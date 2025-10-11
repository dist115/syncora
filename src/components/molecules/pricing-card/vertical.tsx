import { Check, X } from 'lucide-react';

import { Text } from 'rizzui';
import { Box, Flex } from '../../atoms/layout';
import { SubscriptionButton } from '../billing/subscription-button';

export function PricingCardVertical({
  pricing,
  billingPeriod = 'monthly',
  currentPlan,
  teamId = null,
}: {
  pricing: any;
  billingPeriod?: 'monthly' | 'yearly' | 'one-time';
  currentPlan?: boolean;
  teamId?: string | null;
}) {
  const includedFeatures = pricing?.features?.included ?? [];
  const notIncludedFeatures = pricing?.features?.notIncluded ?? [];
  const monthlyPrice = pricing?.plans[0]?.price ?? '';
  const yearlyPrice = pricing?.plans[1]?.price ?? '';
  const planId =
    billingPeriod === 'yearly'
      ? pricing?.plans[1].planId
      : pricing?.plans[0].planId;

  const billingPeriodText = {
    monthly: 'per month',
    yearly: 'per year',
    'one-time': 'for lifetime',
  }[billingPeriod];

  return (
    <Box className="relative">
      <Box className="p-8 text-left border rounded-lg bg-steel-50/30 dark:bg-steel-700 border-steel-100 dark:border-steel-600/50">
        <Flex justify="start" className="mb-2">
          <Text className="text-lg font-medium leading-none text-steel-700 dark:text-steel-100">
            {pricing?.name}
          </Text>
          {currentPlan && (
            <Text className="text-[#1d4ed8] dark:text-[#60a5fa] bg-[#e5f0ff] ring-1 font-medium ring-inset ring-[#dee6fb] dark:ring-[#60a5fa]/30 dark:bg-[#60a5fa]/10 text-xs px-2 py-1 rounded inline-flex">
              Active
            </Text>
          )}
        </Flex>
        <Text className="text-steel-500 dark:text-steel-400">
          {pricing?.description}
        </Text>
        <Flex className="gap-2.5 my-8" justify="start">
          <Text className="text-5xl font-medium tracking-tight text-steel-700 dark:text-steel-100">
            {billingPeriod === 'yearly' ? yearlyPrice : monthlyPrice}
          </Text>
          <Text className="pt-2.5 text-base font-medium text-steel-400 dark:text-steel-400">
            {billingPeriodText}
          </Text>
        </Flex>

        <SubscriptionButton planId={planId} teamId={teamId} />
      </Box>

      <Flex className="pt-8" direction="col" justify="start" align="stretch">
        {includedFeatures?.map((feature: any, index: number) => (
          <Flex key={index} justify="start" className="gap-2">
            <Check
              size={20}
              strokeWidth={2}
              className="text-steel-500 dark:text-steel-300 shrink-0"
            />
            <Text className="text-left text-steel-700 dark:text-steel-100">
              {feature}
            </Text>
          </Flex>
        ))}
        {notIncludedFeatures?.map((feature: any, index: number) => (
          <Flex key={index} justify="start" className="gap-2">
            <X
              size={20}
              strokeWidth={2}
              className="text-steel-300 dark:text-steel-500 shrink-0"
            />
            <Text className="text-left text-steel-400 dark:text-steel-400">
              {feature}
            </Text>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
}
