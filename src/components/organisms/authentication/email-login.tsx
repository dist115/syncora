'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { magicLogin } from '@/server/actions/auth.action';
// import { demoLogin, magicLogin } from '@/server/actions/auth.action';
import { Button, Input, Text } from 'rizzui';
import { toast } from 'sonner';

import { Envelop } from '@/components/atoms/icons/envelop';
import { GoogleIcon } from '@/components/atoms/icons/google';
import { Box, Flex } from '@/components/atoms/layout';
import { useSearchParams } from '@/components/atoms/next/navigation';

// const demoMail = 'diwanmagar925@gmail.com';

export const EmailLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState(''); // CHANGE: Remove demoMail default
  const searchParams = useSearchParams();

  // ADD THIS useEffect - Autofill email from localStorage
  useEffect(() => {
    const lastEmail = localStorage.getItem('lastLoginEmail');
    if (lastEmail) {
      setEmail(lastEmail);
      // Show toast if coming from password login
      if (searchParams?.get('verified') === 'true') {
        toast.success('Password verified!', {
          description: 'Click below to receive magic link',
          duration: 3000,
          position: 'top-center',
        });
      }
    }
  }, [searchParams]);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);

    const { email } = event.target.elements;

    if (!email.value) {
      toast.error('Please enter an email.');
      setIsLoading(false);
      return;
    }
    //NOTE THIS IS ONLY FOR DEMO PURPOSE

    const response = await magicLogin(email.value);


    // const response = await demoLogin(email.value);

    setIsLoading(false);
    if (!response.ok) {
      toast.error('Sign in failed. Please try again.');
      return;
    }

    //toast('Please check your email for a magic link.');
  };

  return (
    <form method="post" onSubmit={handleSubmit} className="space-y-2">
      <Box>
        <Input
          // readOnly={true}
          value={email}
          onChange={(e) => setEmail(e.target.value)} // ADD onChange
          autoComplete="off"
          name="email"
          type="email"
          placeholder="Enter your email"
          className="[&_.rizzui-input-container]:bg-white dark:[&_.rizzui-input-container]:bg-transparent [&_.rizzui-input-container]:focus:ring-gray-500 [&_.rizzui-input-container_input]:w-full lg:[&_.rizzui-input-container]:h-14 [&_.rizzui-input-container]:w-full 3xl:[&_.rizzui-input-container]:w-full [&_.rizzui-input-container]:px-3 md:[&_.rizzui-input-container]:px-5 xl:[&_.rizzui-input-container]:px-7"
          inputClassName="[&.is-focus]:border-gray-500 ring-[#CBD5E1] dark:ring-[#3B404F] [&.is-focus]:ring-2 [&.is-focus]:ring-[#CBD5E1] dark:[&.is-focus]:ring-[#3B404F] [&.is-hover]:border-0 border-0 ring-1 lg:text-base text-[#475569] dark:text-steel-100/40"
          prefix={<Envelop className="w-5 md:w-6 h-5 md:h-6" />}
        />
      </Box>
      <Button
        type="submit"
        isLoading={isLoading}
        className="flex font-semibold items-center justify-center w-full h-10 lg:h-14 !mt-5 text-sm lg:text-base text-white transition-all !bg-custom-black dark:!bg-steel-600 hover:dark:!bg-steel-600/80  border-0 rounded-md hover:!bg-opacity-90 focus:outline-none hover:shadow-sm "
      >
        Sign In
      </Button>
    </form>
  );
};
