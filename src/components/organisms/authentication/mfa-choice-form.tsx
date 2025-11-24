'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Text } from 'rizzui';
import { toast } from 'sonner';
import { verifyMfaAndLoginAction } from '@/server/actions/password-auth.action';
import { magicLogin } from '@/server/actions/auth.action';
import { Box, Flex } from '@/components/atoms/layout';
import { Card } from '@/components/atoms/card';
import { PAGES } from '@/config/pages';
import { Smartphone, Mail } from 'lucide-react';

export const MfaChoiceForm = () => {
  const router = useRouter();
  const [mfaToken, setMfaToken] = useState('');
  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'totp' | 'magic' | null>(null);
  const [totpCode, setTotpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Get MFA data from sessionStorage
    const token = sessionStorage.getItem('mfaToken');
    const id = sessionStorage.getItem('userId');
    const email = sessionStorage.getItem('userEmail');

    if (!token || !id) {
      toast.error('Session expired', {
        description: 'Please login again',
        position: 'top-center',
      });
      router.push('/auth/login');
      return;
    }

    setMfaToken(token);
    setUserId(id);
    setUserEmail(email || '');
  }, [router]);

  const handleTotpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await verifyMfaAndLoginAction({
        mfaToken,
        code: totpCode,
        userId,
      });

      if (!response.ok) {
        toast.error(response.error || 'Verification failed', {
          duration: 4000,
          position: 'top-center',
        });
        setIsLoading(false);
        return;
      }

      // Clear session storage
      sessionStorage.removeItem('mfaToken');
      sessionStorage.removeItem('userId');
      sessionStorage.removeItem('userEmail');

      toast.success('Login successful!', {
        duration: 2000,
        position: 'top-center',
      });
      router.push(PAGES.DASHBOARD.ROOT);
    } catch (error) {
      console.error('TOTP verification error:', error);
      toast.error('An unexpected error occurred', {
        duration: 4000,
        position: 'top-center',
      });
      setIsLoading(false);
    }
  };

  const handleMagicLinkSend = async () => {
    setIsLoading(true);

    try {
      const response = await magicLogin(userEmail);

      if (!response.ok) {
        toast.error('Failed to send magic link', {
          duration: 4000,
          position: 'top-center',
        });
        setIsLoading(false);
        return;
      }

      toast.success('Magic link sent!', {
        description: 'Check your email to complete login',
        duration: 5000,
        position: 'top-center',
      });

      // Clear session storage
      sessionStorage.removeItem('mfaToken');
      sessionStorage.removeItem('userId');
      sessionStorage.removeItem('userEmail');

      // Redirect to a waiting page or back to login
      setTimeout(() => {
        router.push('/auth/login?message=check-email');
      }, 2000);
    } catch (error) {
      console.error('Magic link error:', error);
      toast.error('An unexpected error occurred', {
        duration: 4000,
        position: 'top-center',
      });
      setIsLoading(false);
    }
  };

  if (!selectedMethod) {
    return (
      <Box className="space-y-4">
        <Card
          className="p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 border-gray-200 dark:border-gray-700 hover:border-custom-black dark:hover:border-steel-500"
          onClick={() => setSelectedMethod('totp')}
        >
          <Flex align="center" className="gap-4">
            <Box className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <Smartphone className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </Box>
            <Box>
              <Text className="font-semibold text-lg text-custom-black dark:text-steel-100">
                Authenticator App
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                Use Google Authenticator or similar TOTP app
              </Text>
            </Box>
          </Flex>
        </Card>

        <Card
          className="p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 border-gray-200 dark:border-gray-700 hover:border-custom-black dark:hover:border-steel-500"
          onClick={() => setSelectedMethod('magic')}
        >
          <Flex align="center" className="gap-4">
            <Box className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <Mail className="w-6 h-6 text-green-600 dark:text-green-300" />
            </Box>
            <Box>
              <Text className="font-semibold text-lg text-custom-black dark:text-steel-100">
                Magic Link
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                Receive a secure login link via email
              </Text>
            </Box>
          </Flex>
        </Card>
      </Box>
    );
  }

  if (selectedMethod === 'totp') {
    return (
      <form onSubmit={handleTotpSubmit} className="space-y-6">
        <Box>
          <Button
            type="button"
            variant="outline"
            onClick={() => setSelectedMethod(null)}
            className="mb-4"
          >
            ← Back
          </Button>
        </Box>

        <Box className="text-center">
          <Text className="text-lg font-semibold text-custom-black dark:text-steel-100 mb-2">
            Enter Authenticator Code
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-400">
            Open your authenticator app and enter the 6-digit code
          </Text>
        </Box>

        <Box>
          <Input
            type="text"
            placeholder="000000"
            value={totpCode}
            onChange={(e) => setTotpCode(e.target.value)}
            maxLength={6}
            className="[&_.rizzui-input-container]:text-center [&_.rizzui-input-container]:text-2xl [&_.rizzui-input-container]:tracking-widest [&_.rizzui-input-container]:h-16"
            required
          />
        </Box>

        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full h-12 !bg-custom-black dark:!bg-steel-600"
        >
          Verify & Continue
        </Button>
      </form>
    );
  }

  if (selectedMethod === 'magic') {
    return (
      <Box className="space-y-6">
        <Box>
          <Button
            type="button"
            variant="outline"
            onClick={() => setSelectedMethod(null)}
            className="mb-4"
          >
            ← Back
          </Button>
        </Box>

        <Box className="text-center">
          <Text className="text-lg font-semibold text-custom-black dark:text-steel-100 mb-2">
            Send Magic Link
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            We will send a secure login link to your email
          </Text>
          <Text className="text-base font-medium text-custom-black dark:text-steel-100">
            {userEmail}
          </Text>
        </Box>

        <Button
          type="button"
          onClick={handleMagicLinkSend}
          isLoading={isLoading}
          className="w-full h-12 !bg-custom-black dark:!bg-steel-600"
        >
          Send Magic Link
        </Button>
      </Box>
    );
  }

  return null;
};