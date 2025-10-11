import { NoSymbolIcon } from '@heroicons/react/24/solid';
import {
  ArrowLeftRight,
  Check,
  CircleDollarSign,
  CreditCardIcon,
  DollarSign,
  GemIcon,
  RefreshCcw,
  XIcon,
} from 'lucide-react';

import { Text } from 'rizzui';

import { Card } from '../atoms/card';
import { Box, Flex } from '../atoms/layout';

export function NotificationList() {
  const recent = true;
  return (
    <div className="flex flex-col gap-3 px-6 py-5">
      <Card className="flex items-start gap-3 p-3 rounded-md">
        {recent && (
          <Box className="w-2 h-2 rounded-full bg-[#00B0D9] absolute top-1/2 -translate-y-1/2 -left-4" />
        )}
        <Box className="p-2.5 rounded text-[#00C294] bg-[#00C294]/10 dark:bg-[#00C294]/20 shrink-0">
          <CreditCardIcon strokeWidth={1.25} size={22} />
        </Box>
        <Box className="grow">
          <Flex className="mb-0.5">
            <Text className="font-medium leading-normal text-gray-700 dark:text-gray-100">
              Billing Succeed
            </Text>
            <Text className="text-xs">2 mins ago</Text>
          </Flex>
          <Text className="text-xs leading-normal">
            Billing Succeed for the month of June 2023
          </Text>
        </Box>
      </Card>

      <Card className="flex items-start gap-3 p-3 rounded-md">
        {recent && (
          <Box className="w-2 h-2 rounded-full bg-[#00B0D9] absolute top-1/2 -translate-y-1/2 -left-4" />
        )}
        <Box className="p-2.5 rounded text-[#DE4A4A] bg-[#DE4A4A]/10 dark:bg-[#DE4A4A]/20 shrink-0">
          <CreditCardIcon strokeWidth={1.25} size={22} />
        </Box>
        <Box className="grow">
          <Flex className="mb-0.5">
            <Text className="font-medium leading-normal text-gray-700 dark:text-gray-100">
              Billing Failed
            </Text>
            <Text className="text-xs">15 mins ago</Text>
          </Flex>
          <Text className="text-xs leading-normal">
            Billing failed for the month of June 2023
          </Text>
        </Box>
      </Card>

      <Card className="flex items-start gap-3 p-3 rounded-md bg-steel-50/70 dark:bg-steel-800/90">
        <Box className="p-2.5 rounded text-[#00B0D9] bg-[#00B0D9]/10 dark:bg-[#00B0D9]/20 shrink-0">
          <DollarSign strokeWidth={1.25} size={22} />
        </Box>
        <Box className="grow">
          <Flex className="mb-0.5">
            <Text className="font-medium leading-normal text-gray-700 dark:text-gray-100">
              Subscription Changed
            </Text>
            <Text className="text-xs">1 hour ago</Text>
          </Flex>
          <Text className="text-xs leading-normal">
            John doe just change his subscriptions.
          </Text>
        </Box>
      </Card>

      <Card className="flex items-start gap-3 p-3 rounded-md bg-steel-50/70 dark:bg-steel-800/90">
        <Box className="p-2.5 rounded text-[#FF874C] bg-[#FF874C]/10 dark:bg-[#FF874C]/20 shrink-0">
          <DollarSign strokeWidth={1.25} size={22} />
        </Box>
        <Box className="grow">
          <Flex className="mb-0.5">
            <Text className="font-medium leading-normal text-gray-700 dark:text-gray-100">
              Subscription Ended
            </Text>
            <Text className="text-xs">3 mins ago</Text>
          </Flex>
          <Text className="text-xs leading-normal">
            John doe subscriptions is ended.
          </Text>
        </Box>
      </Card>

      <Card className="flex items-start gap-3 p-3 rounded-md bg-steel-50/70 dark:bg-steel-800/90">
        <Box className="p-2.5 rounded text-[#00C294] bg-[#00C294]/10 dark:bg-[#00C294]/20 shrink-0">
          <DollarSign strokeWidth={1.25} size={22} />
        </Box>
        <Box className="grow">
          <Flex className="mb-0.5">
            <Text className="font-medium leading-normal text-gray-700 dark:text-gray-100">
              Subscription Renewed
            </Text>
            <Text className="text-xs">5 days ago</Text>
          </Flex>
          <Text className="text-xs leading-normal">
            John doe just renewed his subscriptions.
          </Text>
        </Box>
      </Card>

      <Card className="flex items-start gap-3 p-3 rounded-md bg-steel-50/70 dark:bg-steel-800/90">
        <Box className="p-2.5 rounded text-[#DE4A4A] bg-[#DE4A4A]/10 dark:bg-[#DE4A4A]/20 shrink-0">
          <DollarSign strokeWidth={1.25} size={22} />
        </Box>
        <Box className="grow">
          <Flex className="mb-0.5">
            <Text className="font-medium leading-normal text-gray-700 dark:text-gray-100">
              Subscription Cancelled
            </Text>
            <Text className="text-xs">1 week ago</Text>
          </Flex>
          <Text className="text-xs leading-normal">
            John doe just cancelled his subscriptions.
          </Text>
        </Box>
      </Card>
    </div>
  );
}
