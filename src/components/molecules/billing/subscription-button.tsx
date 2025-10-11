'use client';

import { useTransition } from 'react';
import { getRedirectUrl } from '@/server/actions/billing.action';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next-nprogress-bar';
import { Button } from 'rizzui';
import { toast } from 'sonner';

import { env } from '@/env.mjs';
import { cn } from '@/lib/utils/cn';
import { handleError, hasError, showErrorMessage } from '@/lib/utils/error';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { usePathname } from '@/components/atoms/next/navigation';

export const SubscriptionButton = ({
  className,
  planId,
  teamId = null,
}: {
  className?: string;
  planId: string;
  teamId?: string | null;
}) => {
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const router = useRouter();
  const is3xl = useMediaQuery('(min-width:1780px)');

  const handleSubscribe = async () => {
    const url = `${env.NEXT_PUBLIC_BASE_URL}${pathname}`;

    try {
      const response = await getRedirectUrl(planId, teamId, url);
      if (hasError(response)) {
        showErrorMessage(response);
        return;
      }
      if ('url' in response && response && response.url && response.url !== '') {
        router.push(response.url);
      }
      if ('url' in response && response && response.url === '') {
        toast.success(response.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <Button
      className={cn('px-10 group', className)}
      isLoading={isPending}
      onClick={() => startTransition(handleSubscribe)}
      disabled={!planId}
      variant="outline"
      size={is3xl ? 'lg' : 'md'}
    >
      Select Plan
      <ArrowRight
        size={17}
        className="ml-2 transition-all duration-300 group-hover:translate-x-1 group-disabled:translate-x-0"
      />
    </Button>
  );
};
