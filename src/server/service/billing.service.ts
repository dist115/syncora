import 'server-only';

import { db } from '@/db';
import {
  subscription as SubscriptionModel,
  SubscriptionStatus,
} from '@/db/schema';
import { and, desc, eq, isNull, or, sql } from 'drizzle-orm';

import type Stripe from 'stripe';

import {
  FREE_INDIVIDUAL_PLAN_ID,
  FREE_TEAM_PLAN_ID,
  TEAM_PRICING,
  USER_PRICING,
} from '@/config/billing/plans';
import { MESSAGES } from '@/config/messages';

import { StripeService } from './stripe.service';
import { UserService } from './user.service';
import { subscription } from '../../db/schema/subscriptions';

/**
 * Billing Service
 *
 * This service is responsible for managing the billing and subscription
 * Do not call the Stripe API directly from this service
 */

export const BillingService = {
  /**
   * Get the customer ID for a user
   * If the user does not have a customer ID, create one
   *
   * @param userId
   * @returns Customer ID
   */
  getCustomerId: async (userId: string) => {
    const user = await UserService.find(userId);
    if (!user) {
      throw new Error(MESSAGES.USER_NOT_FOUND);
    }
    if (!user.customerId || user.customerId===null) {
      const customer = await StripeService.createCustomer(user);
      await UserService.update(user.id, { customerId: customer.id });
      return customer.id;
    }
    return user.customerId;
  },

  /**
   * Get the subscription for a user
   *
   * @param userId
   * @returns Subscription
   */

  findByUserId: async (userId: string) => {
    const subscriptions = await db.query.subscription.findFirst({
      where: (subscription, { eq }) => eq(subscription.userId, userId),
    });

    if (!subscriptions) {
      throw new Error(MESSAGES.SUBSCRIPTION_NOT_FOUND);
    }
    return subscriptions;
  },

  /**
   * Get the subscription for a subscription ID
   *
   * @param subscriptionId stripe subscription ID
   * @returns Subscription
   */
  findBySubscriptionId: async (subscriptionId: string) => {
    const subscriptions = await db.query.subscription.findFirst({
      where: (subscription, { eq }) =>
        eq(subscription.subscriptionId, subscriptionId),
    });
    return subscriptions ? subscriptions : false;
  },

  hasSubscription: async (customerId: string, planId: string) => {
    const subscriptions = await db.query.subscription.findFirst({
      where: (subscription, { eq }) =>
        and(
          eq(subscription.userId, customerId),
          eq(subscription.planId, planId),
          eq(subscription.status, SubscriptionStatus.Active)
        ),
    });

    return subscriptions ? true : false;
  },

  getActiveSubscription: async (userId: string) => {
    const subscriptions = await db.query.subscription.findFirst({
      where: (subscription, { eq }) =>
        and(
          eq(subscription.userId, userId),
          eq(subscription.status, SubscriptionStatus.Active),
          isNull(subscription.teamId)
        ),
    });

    return subscriptions;
  },

  getActivePlan: async (userId: string) => {
    const subscriptions = await db.query.subscription.findFirst({
      where: (subscription, { eq }) =>
        and(
          eq(subscription.userId, userId),
          eq(subscription.status, SubscriptionStatus.Active)
        ),
    });

    return subscriptions ? subscriptions.planId : FREE_INDIVIDUAL_PLAN_ID;
  },

  getTeamsActiveSubscription: async (teamId: string) => {
    const subscriptions = await db.query.subscription.findFirst({
      where: (subscription, { eq }) =>
        and(
          eq(subscription.teamId, teamId),
          eq(subscription.status, SubscriptionStatus.Active)
        ),
    });

    return subscriptions;
  },

  getCurrentTeamSubscription: async (userId: string, teamId: string) => {
    const subscriptions = await db.query.subscription.findFirst({
      where: (subscription, { eq }) =>
        and(
          eq(subscription.userId, userId),
          eq(subscription.teamId, teamId),
          eq(subscription.status, SubscriptionStatus.Active)
        ),
    });

    return subscriptions;
  },

  /**
   * Create a subscription for a user or attach a team to a subscription
   *
   * @param data
   * @returns
   */
  create: async (data: any) => {
    const [subscription] = await db
      .insert(SubscriptionModel)
      .values(data)
      .returning();

    return subscription;
  },

  /**
   * Update a subscription
   *
   * @param subscriptionId stripe subscription ID
   * @param data
   * @returns Subscription
   */
  update: async (subscriptionId: string, data: any) => {
    const [subscription] = await db
      .update(SubscriptionModel)
      .set(data)
      .where(eq(SubscriptionModel.subscriptionId, subscriptionId))
      .returning();

    return subscription;
  },

  /**
   * Cancel a subscription
   *
   * @param subscriptionId
   * @returns Subscription
   */
  cancel: async (subscriptionId: string) => {
    return await BillingService.update(subscriptionId, {
      status: SubscriptionStatus.Cancelled,
    });
  },

  /**
   * Check if a user has a valid subscription
   *
   * @param userId
   * @returns Boolean
   */

  hasValidSubscription: async (userId: string) => {
    const subscription = await BillingService.findByUserId(userId);
    if (!subscription) {
      return false;
    }
    return subscription.status === SubscriptionStatus.Active;
  },
  mapToSubscriptionStatus: (status: string) => {
    switch (status) {
      case 'incomplete':
        return SubscriptionStatus.Pending;
      case 'incomplete_expired':
        return SubscriptionStatus.Inactive;
      case 'trialing':
      case 'active':
        return SubscriptionStatus.Active;
      case 'past_due':
        return SubscriptionStatus.PastDue;
      case 'canceled':
        return SubscriptionStatus.Cancelled;
      case 'unpaid':
        return SubscriptionStatus.Inactive;
      default:
        return SubscriptionStatus.Pending;
    }
  },

  getCheckoutUrl: async (
    userId: string,
    planId: string,
    teamId: string | null,
    url: string
  ) => {
    const customerId = await BillingService.getCustomerId(userId);
    const metadata = {
      userId: userId,
      teamId: teamId || '',
      planId: planId,
      subscriptionFor: teamId ? 'team' : 'user',
    };

    const defaultPlanId = teamId ? FREE_TEAM_PLAN_ID : FREE_INDIVIDUAL_PLAN_ID;
    FREE_INDIVIDUAL_PLAN_ID;

    const alreadySubscribedToSamePlan = await BillingService.hasSubscription(
      userId,
      planId
    );
    if (alreadySubscribedToSamePlan) {
      throw new Error(MESSAGES.ALREADY_SUBSCRIBED);
    }

    let subscription = null;
    if (teamId) {
      subscription = await BillingService.getTeamsActiveSubscription(teamId);
    } else {
      subscription = await BillingService.getActiveSubscription(userId);
    }
    if (subscription) {
      await StripeService.changedSubscription(
        subscription.subscriptionId,
        planId
      );
      await BillingService.update(subscription.subscriptionId, {
        planId: planId,
        quantity: 1,
        teamId: teamId,
      });

      return {
        url: '',
        message: MESSAGES.SUBSCRIPTION_UPDATED,
      };
    }

    // generate session
    const session = await StripeService.createCheckoutSession(
      customerId,
      planId,
      `${url}?success=true&planId=${planId}`,
      `${url}?cancel=true&planId=${defaultPlanId}`,
      metadata
    );

    return {
      url: session.url,
      message: MESSAGES.SUBSCRIPTION_START,
    };
  },

  /**
   * Webhook handlers
   */

  /**
   * Handle a checkout session completed event
   * We will get metadata from the session and create a subscription if it does not exist
   * Here we are updating the subscription with the user ID and team ID
   *
   * @param session
   */
  handleCheckoutComplete: async (session: Stripe.Checkout.Session) => {
    const subscriptionId = session.subscription as string;

    const data = {
      userId: session.metadata?.userId,
      teamId: session.metadata?.teamId || null,
    };

    const existingSubscription =
      await BillingService.findBySubscriptionId(subscriptionId);
    if (existingSubscription) {
      await BillingService.update(subscriptionId, data);
      return;
    }
    await BillingService.create({
      subscriptionId: subscriptionId,
      ...data,
    });
  },

  /**
   * Handle a subscription updated event
   * This event is fired when a subscription is updated
   * The subscription will be updated
   *
   * @param subscription
   * @returns
   */
  handleSubscriptionCreateOrUpdate: async (
    subscription: Stripe.Subscription
  ) => {
    const user = await UserService.getUserByCustomerId(
      subscription.customer as string
    );

    const existingSubscription = await BillingService.findBySubscriptionId(
      subscription.id
    );
    let storage=await BillingService.setStorageCapacity(subscription.items.data[0].price.id,user?.currentTeamId as string)
    let maxTeam=await BillingService.maxTeamLimit(subscription.items.data[0].price.id,user?.currentTeamId as string)
    const data = {
      status: BillingService.mapToSubscriptionStatus(subscription.status),
      planId: subscription.items.data[0].price.id,
      quantity: subscription.items.data[0].quantity,
      provider: 'stripe',
      userId: user?.id,
      //@ts-ignore
      storage:storage,
      maxTeam:maxTeam,
      subscriptionId: subscription.id,
      currentPeriodStartsAt: new Date(subscription.current_period_start * 1000),
      currentPeriodEndsAt: new Date(subscription.current_period_end * 1000),
      trialStartsAt: subscription.trial_start
        ? new Date(subscription.trial_start * 1000)
        : null,
      trialEndsAt: subscription.trial_end
        ? new Date(subscription.trial_end)
        : null,
    };

    if (!existingSubscription) {
      return await BillingService.create(data);
    }

    await BillingService.update(subscription.id, data);
  },

  /**
   * Handle a subscription cancelled event
   * This event is fired when a subscription is cancelled
   * The subscription will be marked as cancelled
   *
   * @param subscription
   */
  handleCancel: async (subscription: Stripe.Subscription) => {
    const existingSubscription = await BillingService.findBySubscriptionId(
      subscription.id
    );
    if (existingSubscription) {
      await BillingService.cancel(subscription.id);
    }
  },
  setStorageCapacity: async (subscriptionPlanId:string,currentTeamId?:string,)=>{
    let storage = '';
    let createTeam=2

    if (!currentTeamId) {
      const storagePlans = USER_PRICING.flatMap(user => user.plans.map(plan => ({ planId: plan.planId, storage: plan.storage ,teams:plan.teams})));
      storagePlans.map(storagePlan => {
        if (storagePlan.planId === subscriptionPlanId) {
          storage = storagePlan.storage;
          createTeam=storagePlan.teams;
        }
      })
      

    } else {
      const storagePlans = TEAM_PRICING.flatMap(team => team.plans.map(plan => ({ planId: plan.planId, storage: plan.storage,teams:plan.teams })));
      
      storagePlans.map(storagePlan => {
        if (storagePlan.planId === subscriptionPlanId) {
          storage = storagePlan.storage;
          createTeam=storagePlan.teams;
        }
      })
     

    }
   

    return storage as string;

  },
  maxTeamLimit: async (subscriptionPlanId:string,currentTeamId?:string,)=>{
    let maxTeam=2
    if (!currentTeamId) {
      const createTeamsLimit = USER_PRICING.flatMap(user => user.plans.map(plan => ({ planId: plan.planId, storage: plan.storage ,teams:plan.teams})));
      createTeamsLimit.map(teamLimit => {
        if (teamLimit.planId === subscriptionPlanId) {
          maxTeam=teamLimit.teams;
        }
      })
      

    } else {
      const createTeamsLimit = TEAM_PRICING.flatMap(team => team.plans.map(plan => ({ planId: plan.planId, storage: plan.storage,teams:plan.teams })));
      
      createTeamsLimit.map(teamLimit => {
        if (teamLimit.planId === subscriptionPlanId) {
          maxTeam=teamLimit.teams;
        }
      })
     

    }
   

    return maxTeam as number;

  }
};
