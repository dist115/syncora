'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Input, Text, Flex } from 'rizzui';
import { toast } from 'sonner';
import { loginAction, verifyMfaAndLoginAction } from '@/server/actions/password-auth.action';
import { PAGES } from '@/config/pages';

interface MfaVerificationFormProps {
  mfaToken: string;
  userId: string;
  onBack: () => void;
}

export const MfaVerificationForm = ({
  mfaToken,
  userId,
  onBack,
}: MfaVerificationFormProps) => {
  const [mfaCode, setMfaCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mfaCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    setIsLoading(true);

    try {
      const response = await verifyMfaAndLoginAction({
        mfaToken,
        code: mfaCode,
        userId,
      });

      if (!response.ok) {
        toast.error(response.error || 'MFA verification failed');
        setIsLoading(false);
        return;
      }

      toast.success('Login successful!');
      router.push(PAGES.DASHBOARD.ROOT);
    } catch (error) {
      console.error('MFA verification error:', error);
      toast.error('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Box className="text-center">
        <Text className="text-xl lg:text-2xl font-bold text-custom-black dark:text-steel-100">
          Two-Factor Authentication
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 mt-3 text-sm lg:text-base">
          Enter the 6-digit code from your authenticator app
        </Text>
      </Box>

      <Box>
        <Input
          type="text"
          placeholder="000000"
          value={mfaCode}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
            setMfaCode(value);
          }}
          maxLength={6}
          className="[&_.rizzui-input-container]:bg-white dark:[&_.rizzui-input-container]:bg-transparent [&_.rizzui-input-container]:focus:ring-gray-500 [&_.rizzui-input-container_input]:w-full lg:[&_.rizzui-input-container]:h-14 [&_.rizzui-input-container]:w-full [&_.rizzui-input-container]:px-3 md:[&_.rizzui-input-container]:px-5 xl:[&_.rizzui-input-container]:px-7 [&_.rizzui-input-container]:text-center [&_.rizzui-input-container]:text-2xl [&_.rizzui-input-container]:tracking-widest"
          inputClassName="[&.is-focus]:border-gray-500 ring-[#CBD5E1] dark:ring-[#3B404F] [&.is-focus]:ring-2 [&.is-focus]:ring-[#CBD5E1] dark:[&.is-focus]:ring-[#3B404F] [&.is-hover]:border-0 border-0 ring-1 lg:text-base text-[#475569] dark:text-steel-100/40"
          required
        />
        <Text className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          Code expires in 5 minutes
        </Text>
      </Box>

      <Flex direction="col" className="gap-3">
        <Button
          type="submit"
          isLoading={isLoading}
          className="flex font-semibold items-center justify-center w-full h-10 lg:h-14 text-sm lg:text-base text-white transition-all !bg-custom-black dark:!bg-steel-600 hover:dark:!bg-steel-600/80 border-0 rounded-md hover:!bg-opacity-90 focus:outline-none hover:shadow-sm"
        >
          Verify & Sign In
        </Button>

        <Button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="flex font-semibold items-center justify-center w-full h-10 lg:h-14 text-sm lg:text-base text-custom-black dark:text-steel-100 transition-all !bg-gray-100 dark:!bg-steel-700 hover:dark:!bg-steel-700/80 border-0 rounded-md hover:!bg-opacity-90 focus:outline-none"
        >
          Back to Login
        </Button>
      </Flex>
    </form>
  );
};