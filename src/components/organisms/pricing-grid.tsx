'use client';

import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

import { Text} from 'rizzui';
import { Box, Flex } from '../atoms/layout';
import { Separator } from '../atoms/separator';
import { SubscriptionButton } from '../molecules/billing/subscription-button';

export function PricingGrid({
  pricing,
  billingPeriod = 'monthly',
  teamId = null,
}: {
  pricing: any;
  billingPeriod?: 'monthly' | 'yearly' | 'one-time';
  teamId?: string | null;
}) {
  const includedFeatures = pricing?.features?.included ?? [];
  const notIncludedFeatures = pricing?.features?.notIncluded ?? [];

  return (
    <Box className="relative p-8 bg-white border dark:bg-gray-900 dark:border-gray-600 rounded-2xl">
      <Box className="text-center pb-9">
        <Text className="mb-6 text-base font-medium text-gray-900 dark:text-white">
          {pricing?.name}
        </Text>
        <Text className="text-3xl font-medium text-gray-900 dark:text-white">
          {billingPeriod === 'yearly'
            ? pricing?.plans[1].price
            : pricing?.plans[0].price}
        </Text>
      </Box>

      <Separator className="m-0 bg-gray-200 dark:bg-gray-600" />

      <Text className="text-center text-gray-700 py-9 dark:text-gray-300">
        {pricing?.description}
      </Text>

      <Separator className="m-0 bg-gray-200 dark:bg-gray-600" />

      <Flex className="py-9" direction="col" justify="start" align="stretch">
        {includedFeatures?.map((feature: any, index: number) => (
          <Flex key={index} justify="start" className="gap-2">
            <CheckCircleIcon className="text-[#38a974] w-[22px] h-auto" />
            <Text className="text-left text-gray-900 dark:text-gray-300">
              {feature}
            </Text>
          </Flex>
        ))}
        {notIncludedFeatures?.map((feature: any, index: number) => (
          <Flex key={index} justify="start" className="gap-2">
            <XCircleIcon className="w-[22px] h-auto text-gray-400" />
            <Text className="text-left text-gray-900 dark:text-gray-300">
              {feature}
            </Text>
          </Flex>
        ))}
      </Flex>

      <SubscriptionButton
        planId={
          billingPeriod === 'yearly'
            ? pricing?.plans[1].planId
            : pricing?.plans[0].planId
        }
        teamId={teamId}
      />
    </Box>
  );
}
