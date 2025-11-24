'use client';

import { FREE_TEAM_PLAN_ID, TEAM_PRICING } from '@/config/billing/plans';
import { Box } from '@/components/atoms/layout';

import { PricingCardHorizontal } from '../molecules/pricing-card/horizontal';
import { CurrentPlanSummary } from './current-plan-summary';

export function TeamPricing({
  subscription,
  teamId,
}: {
  subscription?: any | null;
  teamId?: string | null;
}) {
  const currentPlanId = subscription?.planId || FREE_TEAM_PLAN_ID;

  const currentPlan = TEAM_PRICING.find((plan) =>
    plan.plans.some((subPlan) => subPlan.planId === currentPlanId)
  );
  const currentPlanName = currentPlan?.name ?? '';

  return (
    <Box className="flex flex-col w-full gap-8 mx-auto max-w-[1230px]">
      {subscription && (
        <CurrentPlanSummary
          subscription={subscription}
          currentPlanName={currentPlanName}
        />
      )}

      {TEAM_PRICING.map((pricing, index) => (
        <PricingCardHorizontal
          plan={pricing}
          key={index}
          billingPeriod="monthly"
          isCurrentPlan={currentPlanId === pricing.plans[0].planId}
          teamId={teamId}
        />
      ))}
    </Box>
  );
}
