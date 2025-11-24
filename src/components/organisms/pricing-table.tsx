'use client';

import { motion } from 'framer-motion';

import { USER_PRICING } from '@/config/billing/plans';
import { cn } from '@/lib/utils/cn';
import { Box, Flex, Grid } from '@/components/atoms/layout';

import { Tab } from '../atoms/tab';
import { PricingCardHorizontal } from '../molecules/pricing-card/horizontal';
import { PricingCardVertical } from '../molecules/pricing-card/vertical';

const billingPeriods = ['Monthly', 'Yearly'];

export function PricingTable({
  currentPlan,
  teamId = null,
}: {
  currentPlan?: string;
  teamId?: string | null;
}) {
  return (
    <Box className="text-center w-[800px] max-w-full mx-auto">
      <Tab.Group>
        <Tab.List className="inline-flex p-1 mb-8 space-x-1 rounded-lg bg-steel-50 dark:bg-steel-600/50 focus:outline-none">
          {billingPeriods.map((periodName) => (
            <Tab
              key={periodName}
              className={({ selected }) =>
                cn(
                  'w-full rounded-lg py-2.5 px-7 text-sm font-medium leading-5 text-steel-500 dark:text-steel-300 dark:hover:text-steel-100 relative  transition-all focus:outline-none ring-0 hover:text-steel-700 outline-none',
                  { 'text-steel-700 dark:text-steel-100': selected }
                )
              }
            >
              {({ selected }) => (
                <>
                  {selected && (
                    <motion.span
                      className="absolute bottom-0 left-0 right-0 w-full h-full bg-white rounded-lg shadow dark:bg-steel-800 md:z-0"
                      layoutId="underline"
                    />
                  )}
                  <span className="relative">{periodName}</span>
                </>
              )}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <Grid columns="2" className="justify-center gap-7">
              {USER_PRICING.map((product, index) => (
                <PricingCardVertical
                  pricing={product}
                  key={index}
                  billingPeriod="monthly"
                  teamId={teamId}
                />
              ))}
            </Grid>
          </Tab.Panel>
          <Tab.Panel>
            <Grid columns="2" className="justify-center gap-7">
              {USER_PRICING.map((product, index) => (
                <PricingCardVertical
                  pricing={product}
                  key={index}
                  billingPeriod="yearly"
                  teamId={teamId}
                />
              ))}
            </Grid>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </Box>
  );
}
