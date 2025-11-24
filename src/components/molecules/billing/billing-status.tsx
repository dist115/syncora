import { CheckCircle, Frown } from 'lucide-react';
import { Text, Title } from 'rizzui';

import { Card } from '@/components/atoms/card';

export function BillingStatus({ searchParams }: { searchParams: any }) {
  if (searchParams?.success === 'true')
    return (
      <Card className="w-[600px] max-w-full mx-auto text-center my-8">
        <CheckCircle
          strokeWidth={0.75}
          className="mx-auto mb-3 lg:mb-5 xl:mb-8 text-steel-700 dark:text-steel-100 w-10 sm:w-12 h-10 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16"
        />
        <Title className="mb-2 lg:mb-4 text-xl md:text-2xl lg:text-3xl">
          Congratulations!
        </Title>
        <Text>You have successfully purchased your plan.</Text>
      </Card>
    );
  if (searchParams?.success === 'false')
    return (
      <Card className="w-[600px] max-w-full mx-auto text-center my-8">
        <Frown
          size={68}
          strokeWidth={0.75}
          className="mx-auto mb-3 lg:mb-5 xl:mb-8 text-steel-700 dark:text-steel-100 w-10 sm:w-12 h-10 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16"
        />
        <Title className="mb-2 lg:mb-4 text-xl md:text-2xl lg:text-3xl">
          Purchased Failed!
        </Title>
        <Text>Purchasing the plan has not been successful.</Text>
      </Card>
    );
  if (searchParams?.cancel === 'true')
    return (
      <Card className="w-[600px] max-w-full mx-auto text-center my-8">
        <CheckCircle
          size={68}
          strokeWidth={0.75}
          className="mx-auto mb-3 lg:mb-5 xl:mb-8 text-steel-700 dark:text-steel-100 w-10 sm:w-12 h-10 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16"
        />
        <Title className="mb-2 lg:mb-4 text-xl md:text-2xl lg:text-3xl">
          Canceled!
        </Title>
        <Text>You have successfully canceled your plan.</Text>
      </Card>
    );
  if (searchParams?.cancel !== 'false')
    return (
      <Card className="w-[600px] max-w-full mx-auto text-center my-8">
        <Frown
          size={68}
          strokeWidth={0.75}
          className="mx-auto mb-3 lg:mb-5 xl:mb-8 text-steel-700 dark:text-steel-100 w-10 sm:w-12 h-10 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16"
        />
        <Title className="mb-2 lg:mb-4 text-xl md:text-2xl lg:text-3xl">
          Cancelation Failed!
        </Title>
        <Text>Your plan cancellation has not been successful.</Text>
      </Card>
    );

  return false;
}
