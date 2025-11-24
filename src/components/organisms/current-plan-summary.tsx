'use client';

import { format } from 'date-fns';
import { Text } from 'rizzui';

import { Card } from '@/components/atoms/card';
import { Box, Grid } from '@/components/atoms/layout';

export function CurrentPlanSummary({
  subscription,
  currentPlanName,
}: {
  subscription?: any | null;
  currentPlanName: string;
}) {
  return (
    <Card className="mb-0">
      <Grid className="text-left grid-cols-2 sm:grid-cols-4 sm:text-center">
        <Box>
          <Text className="mb-2 font-semibold">Current Plan</Text>
          <Text className="truncate text-steel-700 dark:text-steel-100">
            {currentPlanName}
          </Text>
        </Box>
        <Box>
          <Text className="mb-2 font-semibold">Status</Text>

          <Text className="text-green font-medium">
            {subscription.status}
          </Text>
        </Box>
        <Box>
          <Text className="mb-2 font-semibold">Start From</Text>
          <Text className="truncate text-steel-700 dark:text-steel-100">
            {format(subscription.currentPeriodStartsAt, 'MMM dd, yyyy')}
          </Text>
        </Box>
        <Box>
          <Text className="mb-2 font-semibold">Renew Date</Text>
          <Text className="truncate text-steel-700 dark:text-steel-100">
            {format(subscription.currentPeriodEndsAt, 'MMM dd, yyyy')}
          </Text>
        </Box>
      </Grid>
    </Card>
  );
}
