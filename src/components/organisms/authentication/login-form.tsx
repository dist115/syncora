'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Password, Text } from 'rizzui';
import { toast } from 'sonner';
import { loginAction } from '@/server/actions/password-auth.action';
import { Box, Flex } from '@/components/atoms/layout';
import Link from '@/components/atoms/next/link';
import { PAGES } from '@/config/pages';
import { Envelop } from '@/components/atoms/icons/envelop';

export const LoginForm = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await loginAction(formData);

            if (!response.ok) {
                if (response.needsVerification) {
                    toast.error('Email not verified', {
                        description: 'Please verify your email before logging in',
                        duration: 4000,
                        position: 'top-center',
                    });
                    setIsLoading(false);
                    return;
                }
                toast.error(response.error || 'Login failed', {
                    duration: 4000,
                    position: 'top-center',
                });
                setIsLoading(false);
                return;
            }

            // If MFA is enabled, redirect to MFA choice page
            if (response.needsMfa) {
                toast.success('Password verified!', {
                    description: 'Choose your verification method',
                    duration: 2000,
                    position: 'top-center',
                });
                // Store MFA data in sessionStorage temporarily
                sessionStorage.setItem('mfaToken', response.mfaToken);
                sessionStorage.setItem('userId', response.userId);
                router.push('/auth/mfa-choice');
                return;
            }

            // NEW: Direct login success - redirect to default login page
            toast.success('Password verified!', {
                description: 'Complete verification with email',
                duration: 2000,
                position: 'top-center',
            });

            // Store email for autofill in default login
            localStorage.setItem('lastLoginEmail', formData.email); // ADD THIS

            // Redirect to default login page (/login)
            router.push('/login?verified=true'); // ADD THIS - redirect to default login
        } catch (error) {
            console.error('Login error:', error);
            toast.error('An unexpected error occurred', {
                description: 'Please try again later',
                duration: 4000,
                position: 'top-center',
            });
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Box>
                <Input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    className="[&_.rizzui-input-container]:bg-white dark:[&_.rizzui-input-container]:bg-transparent [&_.rizzui-input-container]:focus:ring-gray-500 [&_.rizzui-input-container_input]:w-full lg:[&_.rizzui-input-container]:h-14 [&_.rizzui-input-container]:w-full [&_.rizzui-input-container]:px-3 md:[&_.rizzui-input-container]:px-5 xl:[&_.rizzui-input-container]:px-7"
                    inputClassName="[&.is-focus]:border-gray-500 ring-[#CBD5E1] dark:ring-[#3B404F] [&.is-focus]:ring-2 [&.is-focus]:ring-[#CBD5E1] dark:[&.is-focus]:ring-[#3B404F] [&.is-hover]:border-0 border-0 ring-1 lg:text-base text-[#475569] dark:text-steel-100/40"
                    prefix={<Envelop className="w-5 md:w-6 h-5 md:h-6" />}
                    required
                />
            </Box>

            <Box>
                <Password
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="[&_.rizzui-input-container]:bg-white dark:[&_.rizzui-input-container]:bg-transparent [&_.rizzui-input-container]:focus:ring-gray-500 [&_.rizzui-input-container_input]:w-full lg:[&_.rizzui-input-container]:h-14 [&_.rizzui-input-container]:w-full [&_.rizzui-input-container]:px-3 md:[&_.rizzui-input-container]:px-5 xl:[&_.rizzui-input-container]:px-7"
                    inputClassName="[&.is-focus]:border-gray-500 ring-[#CBD5E1] dark:ring-[#3B404F] [&.is-focus]:ring-2 [&.is-focus]:ring-[#CBD5E1] dark:[&.is-focus]:ring-[#3B404F] [&.is-hover]:border-0 border-0 ring-1 lg:text-base text-[#475569] dark:text-steel-100/40"
                    required
                />
            </Box>

            <Flex justify="end" className="pt-2">
                <Link
                    href="/auth/forgot-password"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
                >
                    Forgot password?
                </Link>
            </Flex>

            <Button
                type="submit"
                isLoading={isLoading}
                className="flex font-semibold items-center justify-center w-full h-10 lg:h-14 !mt-5 text-sm lg:text-base text-white transition-all !bg-custom-black dark:!bg-steel-600 hover:dark:!bg-steel-600/80 border-0 rounded-md hover:!bg-opacity-90 focus:outline-none hover:shadow-sm"
            >
                Log In
            </Button>

            <Flex justify="center" className="pt-4">
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                    Don't have an account?{' '}
                    <Link
                        href="/auth/signup"
                        className="font-semibold text-custom-black dark:text-steel-100 hover:underline"
                    >
                        Sign Up
                    </Link>
                </Text>
            </Flex>

            {/* <Flex justify="center" className="pt-2">
        <Text className="text-xs text-gray-500 dark:text-gray-500">
          Or continue with{' '}
          <Link
            href="/login"
            className="font-semibold text-custom-black dark:text-steel-100 hover:underline"
          >
            Magic Link
          </Link>
        </Text>
      </Flex> */}
        </form>
    );
};