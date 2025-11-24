'use client';

import { useTransition } from 'react';
import { RiMoneyDollarCircleLine } from 'react-icons/ri';
import { Button } from 'rizzui';

import { env } from '@/env.mjs';
import { API } from '@/config/api';
import { handleError } from '@/lib/utils/error';
import { usePathname } from '@/components/atoms/next/navigation';

export const ManageBilling = () => {
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  const handleRedirect = async () => {
    const redirectUrl = `${env.NEXT_PUBLIC_BASE_URL}${pathname}`;
    try {
      const { url } = await fetch(API.BILLING_PORTAL_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ redirectUrl }),
      })
        .then((res) => res.json())
        .catch(handleError);

      if (url) window.location.href = url;
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <Button
      isLoading={isPending}
      onClick={() => startTransition(handleRedirect)}
      className="w-full [@media(min-width:375px)]:w-auto"
      >
      <RiMoneyDollarCircleLine size={20} className="mr-1.5" />
      Manage Billing
    </Button>
  );
};
