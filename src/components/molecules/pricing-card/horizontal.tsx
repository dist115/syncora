import { Check, X } from 'lucide-react';
import { Text } from 'rizzui';

import { Box, Flex } from '@/components/atoms/layout';

import { SubscriptionButton } from '../billing/subscription-button';

export function PricingCardHorizontal({
  plan,
  billingPeriod = 'monthly',
  isCurrentPlan,
  teamId = null,
}: {
  plan: any;
  billingPeriod?: 'monthly' | 'yearly' | 'one-time';
  isCurrentPlan: boolean;
  teamId?: string | null;
}) {
  const includedFeatures = plan?.features?.included ?? [];
  const notIncludedFeatures = plan?.features?.notIncluded ?? [];
  const price = plan?.plans[0]?.price;
  const planId = plan?.plans[0]?.planId;


  return (
    <Flex
      direction="col"
      className="relative items-stretch gap-0 p-1 text-left border rounded-xl border-steel-100 dark:border-steel-600/50 lg:flex-row"
    >
      <Box className="p-4 sm:p-6 xl:p-9">
        <Box className="max-w-xl pb-9">
          <Flex justify="start" className="mb-4">
            <Text className="text-xl md:text-2xl lg:text-[28px] font-semibold leading-none text-steel-700 dark:text-steel-100">
              {plan?.name}
            </Text>
            {isCurrentPlan && (
              <Text className="text-[#1d4ed8] dark:text-[#60a5fa] bg-[#e5f0ff] ring-1 font-medium ring-inset ring-[#dee6fb] dark:ring-[#60a5fa]/30 dark:bg-[#60a5fa]/10 text-xs px-2 py-1 rounded inline-flex">
                Active
              </Text>
            )}
          </Flex>
          <Text className="leading-loose">
            Just answer a few questions so that we can personalize the right
            experience for you. unknown printer took a type and scrambled it to
            make a type
          </Text>
        </Box>
        <Box className="relative before:w-full before:h-px before:border-t before:border-dashed before:border-steel-100 dark:before:border-steel-600 before:absolute before:top-1/2 before:left-0 ">
          <span className="relative z-10 inline-block text-base font-semibold bg-white pe-5 dark:bg-steel-900">
            What’s Included
          </span>
        </Box>
        <Flex
          className="flex-wrap w-auto -mx-2 pt-4 md:pt-7 gap-x-0 gap-y-3 mc:gap-y-8"
          justify="start"
        >
          {includedFeatures?.map((feature: any, index: number) => (
            <Flex
              key={index}
              justify="start"
              className="w-full [@media(min-width:540px)]:w-1/2 md:!w-1/3 gap-2 px-2"
            >
              <Flex
                className="w-4 h-4 bg-green-200 rounded-full shrink-0 "
                justify="center"
              >
                <Check
                  size={12}
                  strokeWidth={2}
                  className="text-green-700 shrink-0"
                />
              </Flex>
              <Text className="text-left text-steel-700 dark:text-steel-100">
                {feature}
              </Text>
            </Flex>
          ))}
          {notIncludedFeatures?.map((feature: any, index: number) => (
            <Flex
              key={index}
              justify="start"
              className="w-full [@media(min-width:540px)]:w-1/2 md:!w-1/3 gap-2 px-2"
            >
              <Flex
                className="w-4 h-4 bg-red-200 rounded-full shrink-0 "
                justify="center"
              >
                <X
                  size={12}
                  strokeWidth={2}
                  className="text-red-600 shrink-0"
                />
              </Flex>
              <Text className="text-left text-steel-400 dark:text-steel-400">
                {feature}
              </Text>
            </Flex>
          ))}
        </Flex>
      </Box>
      <Flex
        className="gap-0 px-8 lg:px-16 py-10 lg:w-[360px] bg-slate-100 dark:bg-steel-700 rounded-xl shrink-0"
        direction="col"
      >
        <Text className="text-center text-steel-500 dark:text-steel-400">
          {plan?.description}
        </Text>
        <Flex className="gap-2.5 mb-3 xl:mb-4 2xl:mb-6 mt-4 justify-center">
          <Text className="text-2xl sm:text-3xl xl:text-4xl 2xl:text-5xl font-bold tracking-tight text-steel-700 dark:text-steel-100">
            {price}
          </Text>
        </Flex>

        <SubscriptionButton
          planId={planId}
          teamId={teamId}
          className="mx-auto !max-w-[210px] mb-2 font-semibold border-steel-800 text-steel-900 dark:text-steel-50 dark:border-steel-50"
        />
        <Text className="leading-loose text-center text-steel-500 dark:text-steel-400">
          Invoices and receipts available for easy company reimbursement
        </Text>
      </Flex>
    </Flex>
  );
}
