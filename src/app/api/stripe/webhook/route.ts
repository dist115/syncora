import { NextResponse }  from 'next/server';
import { BillingService, stripe } from '@/server/service';
import type Stripe from 'stripe';

import { env } from '@/env.mjs';

interface CustomHeaders extends Headers {
  'stripe-signature'?: string;
}

const WEBHOOK_EVENTS = {
  SESSION_COMPLETED: 'checkout.session.completed',
  SUBSCRIPTION_UPDATED: 'customer.subscription.updated',
  SUBSCRIPTION_CREATED: 'customer.subscription.created',
  SUBSCRIPTION_DELETED: 'customer.subscription.deleted',
};

/**
 * Handle Stripe Webhooks
 * @param request
 * @returns
 * @see https://stripe.com/docs/billing/subscriptions/build-subscriptions
 */

export async function POST(request: Request) {
  const headers = request.headers as CustomHeaders;
  const signature = headers.get('stripe-signature') || '';
  const data = await request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      data,
      signature,
      env.STRIPE_WEBHOOKS_SECRET
    );
  } catch (error) {
    return new NextResponse(`Webhook error: ${error}`, { status: 400 });
  }
  console.log(`✅ Webhook signature verified.`);
  switch (event.type) {
    case WEBHOOK_EVENTS.SESSION_COMPLETED:
      await BillingService.handleCheckoutComplete(
        event.data.object as Stripe.Checkout.Session
      );
      break;
    case WEBHOOK_EVENTS.SUBSCRIPTION_CREATED:
    case WEBHOOK_EVENTS.SUBSCRIPTION_UPDATED:
      BillingService.handleSubscriptionCreateOrUpdate(
        event.data.object as Stripe.Subscription
      );
      break;

    case WEBHOOK_EVENTS.SUBSCRIPTION_DELETED:
      await BillingService.handleCancel(
        event.data.object as Stripe.Subscription
      );
      break;
  }

  return new NextResponse(null, { status: 200 });
}
