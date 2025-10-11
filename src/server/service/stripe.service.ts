import 'server-only';

import { User } from '@/db/schema';
import Stripe from 'stripe';

import { env } from '@/env.mjs';
import { MESSAGES } from '@/config/messages';
import { metadata } from '@/app/layout';

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  typescript: true,
  apiVersion: '2024-09-30.acacia',
});

/**
 * Stripe API Service
 *
 * No user data should be passed to this service
 * All user data should be passed to the Billing Service
 * This service is responsible for managing the Stripe API
 */

export const StripeService = {
  /**
   * Create a customer
   * @param user
   * @returns Customer
   * @throws Error
   * @see https://stripe.com/docs/api/customers/create
   */

  createCustomer: async (user: User) => {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name as string,
      metadata: {
        userId: user.id,
      },
    });
    return customer;
  },

  /**
   * Get a customer
   * @param customerId
   * @returns Customer
   * @throws Error
   * @see https://stripe.com/docs/api/customers/retrieve
   */
  getCustomer: async (customerId: string) => {
    const customer = await stripe.customers.retrieve(customerId);
    return customer;
  },

  /**
   * Create a subscription
   *
   * @param customerId
   * @param priceId
   * @param quantity
   * @returns Subscription
   * @throws Error
   * @see https://stripe.com/docs/api/subscriptions/create
   */
  createSubscription: async (
    customerId: string,
    priceId: string,
    quantity: number = 1
  ) => {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: priceId,
          quantity: quantity,
        },
      ],
    });
    return subscription;
  },

  /**
   * Get a subscription
   *
   * @param subscriptionId
   * @returns Subscription
   * @throws Error
   * @see https://stripe.com/docs/api/subscriptions/retrieve
   */
  getSubscription: async (subscriptionId: string) => {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  },

  changedSubscription: async (
    subscriptionId: string,
    priceId: string,
    quantity: number = 1,
    metadata?: any
  ) => {
    const subscription = await StripeService.getSubscription(subscriptionId);
    const prorationDate = Math.floor(Date.now() / 1000);

    if (!subscription) {
      throw new Error(MESSAGES.SUBSCRIPTION_NOT_FOUND);
    }
    const subscriptionItem = subscription.items.data[0];
    const subscriptionItemId = subscriptionItem.id;
    const updatedSubscription = await stripe.subscriptions.update(
      subscriptionId,
      {
        items: [
          {
            id: subscriptionItemId,
            deleted: true,
          },
          {
            price: priceId,
            quantity: quantity,
          },
        ],
        proration_date: prorationDate,
      }
    );

    return updatedSubscription;
  },

  /**
   * Cancel a subscription
   *
   * @param subscriptionId
   * @returns Subscription
   * @throws Error
   * @see https://stripe.com/docs/api/subscriptions/cancel
   */
  cancelSubscription: async (subscriptionId: string) => {
    const subscription = await stripe.subscriptions.cancel(subscriptionId);
    return subscription;
  },

  /**
   * Get a subscription
   *
   * @param subscriptionId
   * @returns Subscription
   * @throws Error
   * @see https://stripe.com/docs/api/subscriptions/retrieve
   */
  getSubscriptions: async (customerId: string) => {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
    });
    return subscriptions;
  },

  /**
   * Get a subscription
   *
   * @param subscriptionId
   * @returns Subscription
   * @throws Error
   * @see https://stripe.com/docs/api/subscriptions/retrieve
   */
  getSubscriptionDetails: async (subscriptionId: string) => {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    if (!subscription) {
      throw new Error(MESSAGES.SUBSCRIPTION_NOT_FOUND);
    }

    return {
      id: subscription.id,
      status: subscription.status,
      stripeCustomerId: subscription.customer,
      stripePriceId: subscription.items.data[0].price.id,
      quantity: subscription.items.data[0].quantity,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      onTrial: subscription.trial_end ? true : false,
      trialStart: subscription.trial_start,
      trialEnd: subscription.trial_end
        ? new Date(subscription.trial_end * 1000)
        : null,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      canceledAt: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000)
        : null,
    };
  },

  /**
   * Get payment methods
   * @param customerId
   * @returns PaymentMethod[]
   * @throws Error
   * @see https://stripe.com/docs/api/payment_methods/list
   */
  getPaymentMethods: async (customerId: string) => {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });
    return paymentMethods;
  },

  /**
   * Attach a payment method
   * @param customerId
   * @param paymentMethodId
   * @returns PaymentMethod
   * @throws Error
   * @see https://stripe.com/docs/api/payment_methods/attach
   */
  createPaymentMethod: async (customerId: string, paymentMethodId: string) => {
    const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
    return paymentMethod;
  },

  /**
   * Detach a payment method
   * @param paymentMethodId
   * @returns PaymentMethod
   * @throws Error
   * @see https://stripe.com/docs/api/payment_methods/detach
   */
  deletePaymentMethod: async (paymentMethodId: string) => {
    const paymentMethod = await stripe.paymentMethods.detach(paymentMethodId);
    return paymentMethod;
  },

  /**
   * Has a subscription
   * @param customerId
   * @returns Boolean
   * @see https://stripe.com/docs/api/subscriptions/list
   */
  hasSubscription: async (customerId: string) => {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
    });
    return subscriptions.data.length > 0;
  },

  /**
   * Create a checkout session
   * @param customerId
   * @param priceId
   * @param success_url
   * @param cancel_url
   * @param quantity
   * @returns Session
   * @throws Error
   * @see https://stripe.com/docs/api/checkout/sessions/create
   */
  createCheckoutSession: async (
    customerId: string,
    priceId: string,
    success_url: string,
    cancel_url: string,
    metadata: any,
    quantity: number = 1
  ) => {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      billing_address_collection: 'auto',
      line_items: [
        {
          price: priceId,
          quantity: quantity,
        },
      ],
      success_url,
      cancel_url,
      metadata,
    });
    return session;
  },

  /**
   * Create a customer portal session
   * @param customerId
   * @param url
   * @returns Session
   * @see https://stripe.com/docs/api/customer_portal/sessions/create
   */
  createCustomerPortalSession: async (customerId: string, url: string) => {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: url,
    });
    return session;
  },

  /**
   * Update usage record
   * @param subscriptionId
   * @param quantity
   * @returns
   * @see https://stripe.com/docs/api/usage_records/create
   */
  updateUsageRecord: async (subscriptionId: string, quantity: number) => {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscriptionId,
          quantity,
        },
      ],
    });
    return subscription;
  },

  /**
   * Update billing address
   * @param customerId
   * @param address
   * @returns Address
   * @see https://stripe.com/docs/api/customers/update
   */
  updateBillingAddress: async (customerId: string, address: any) => {
    return await stripe.customers.update(customerId, {
      address,
    });
  },

  /**
   * Apply a coupon
   * @param customerId
   * @param coupon
   * @returns Customer
   * @see https://stripe.com/docs/api/customers/update
   */
  applyCoupon: async (customerId: string, coupon: string) => {
    return await stripe.customers.update(customerId, {
      coupon,
    });
  },

  /**
   * Get billing history
   * @param customerId
   * @param limit
   * @returns Invoices
   * @see https://stripe.com/docs/api/invoices/list
   */
  getBillingHistory: async (customerId: string, limit: number = 12) => {
    const invoices = await stripe.invoices.list({
      customer: customerId,
      limit: limit,
    });
    return invoices;
  },
};
