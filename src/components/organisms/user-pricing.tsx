'use client';

import { FREE_INDIVIDUAL_PLAN_ID, USER_PRICING } from '@/config/billing/plans';
import { Box } from '@/components/atoms/layout';
import { PricingCardHorizontal } from '@/components/molecules/pricing-card/horizontal';
import { CurrentPlanSummary } from '@/components/organisms/current-plan-summary';

export function UserPricing({ subscription }: { subscription: any }) {
  const currentPlanId = subscription?.planId ?? FREE_INDIVIDUAL_PLAN_ID;

  const currentPlan = USER_PRICING.find((plan) =>
    plan.plans.some((subPlan) => subPlan.planId === currentPlanId)
  );
  const currentPlanName = currentPlan?.name ?? '';

  return (
    <Box className="text-center max-w-[1000px] mx-auto flex flex-col gap-8">
      {subscription && (
        <CurrentPlanSummary
          subscription={subscription}
          currentPlanName={currentPlanName}
        />
      )}

      {USER_PRICING.map((pricingPlan, index) => (
        <PricingCardHorizontal
          plan={pricingPlan}
          key={index}
          isCurrentPlan={pricingPlan.plans[0].planId == currentPlanId}
        />
      ))}
    </Box>
  );
}
