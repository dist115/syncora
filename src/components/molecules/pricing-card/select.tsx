import { CheckCircle2, Circle } from 'lucide-react';

import { cn } from '@/lib/utils/cn';

import { Text, Title } from 'rizzui';
import { Box, Flex } from '../../atoms/layout';

export function PricingCard({
  pricing,
  billingPeriod = 'monthly',
  currentPlan,
}: {
  pricing: any;
  billingPeriod?: 'monthly' | 'yearly';
  currentPlan?: boolean;
}) {
  const monthlyPrice = pricing?.plans[0]?.price ?? '';
  const yearlyPrice = pricing?.plans[1]?.price ?? '';

  return (
    <Flex
      className={cn(
        'p-6 transition-all border rounded-lg group cursor-pointer border-steel-200 dark:border-steel-600 ring-1 ring-steel-50 dark:ring-steel-600 hover:border-steel-400 hover:ring-steel-100 dark:hover:border-steel-500 dark:hover:ring-steel-500'
      )}
    >
      <Circle
        className="transition-all text-steel-300 dark:text-steel-500 group-hover:text-steel-400 group-hover:dark:text-steel-400 icon-circle"
        size={20}
        strokeWidth={1.75}
      />
      <CheckCircle2
        className="hidden transition-all text-steel-700 dark:text-steel-100 icon-check"
        size={20}
        strokeWidth={1.75}
      />

      <Box className="grow">
        <Flex className="mb-1">
          <Title className="flex gap-2 text-sm font-semibold">
            {pricing?.name}
            {currentPlan && (
              <Text className="text-[#1d4ed8] dark:text-[#60a5fa] bg-[#e5f0ff] ring-1 font-medium ring-inset ring-[#dee6fb] dark:ring-[#60a5fa]/30 dark:bg-[#60a5fa]/10 text-xs px-2 py-1 rounded inline-flex">
                Current
              </Text>
            )}
          </Title>
          <Flex className="gap-0.5" justify="end">
            <Text className="font-semibold text-steel-700 dark:text-steel-100 ">
              {billingPeriod === 'monthly' ? monthlyPrice : yearlyPrice}
            </Text>
            <Text>{billingPeriod === 'monthly' ? '/month' : '/year'}</Text>
          </Flex>
        </Flex>
        <Text>{pricing?.description}</Text>
      </Box>
    </Flex>
  );
}
