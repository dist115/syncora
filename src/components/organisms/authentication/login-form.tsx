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
    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        // Clear errors when typing
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({ email: '', password: '' });
        setIsLoading(true);

        try {
            const response = await loginAction(formData);

            if (!response.ok) {
                setIsLoading(false);

                // No account found
                if (response.errorType === 'no_account') {
                    setErrors({ email: 'No account found with this email', password: '' });
                    toast.error("Account not found", {
                        description: "Please create an account first",
                        duration: 5000,
                        position: 'top-center',
                    });
                    return;
                }

                // Wrong password
                if (response.errorType === 'wrong_password') {
                    setErrors({ email: '', password: 'Incorrect password' });
                    toast.error("Incorrect password", {
                        description: "Please try again",
                        duration: 4000,
                        position: 'top-center',
                    });
                    return;
                }

                // Generic error
                toast.error(response.error || 'Login failed', {
                    duration: 4000,
                    position: 'top-center',
                });
                return;
            }

            // Success - MFA enabled
            if (response.needsMfa) {
                toast.success('Password verified!', {
                    description: 'Choose your verification method',
                    duration: 2000,
                    position: 'top-center',
                });
                sessionStorage.setItem('mfaToken', response.mfaToken);
                sessionStorage.setItem('userId', response.userId);
                sessionStorage.setItem('userEmail', response.userEmail);
                router.push('/auth/mfa-choice');
                return;
            }

            // Success - No MFA, redirect to magic link page
            toast.success('Password verified!', {
                description: 'Complete verification with magic link',
                duration: 2000,
                position: 'top-center',
            });

            localStorage.setItem('lastLoginEmail', formData.email);
            
            setTimeout(() => {
                router.push('/login?verified=true');
            }, 1000);

        } catch (error) {
            console.error('Login error:', error);
            setIsLoading(false);
            toast.error('Connection error', {
                description: 'Please check your internet connection',
                duration: 4000,
                position: 'top-center',
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <Box>
                <Input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    className="[&_.rizzui-input-container]:bg-white dark:[&_.rizzui-input-container]:bg-transparent [&_.rizzui-input-container]:focus:ring-gray-500 [&_.rizzui-input-container_input]:w-full lg:[&_.rizzui-input-container]:h-14 [&_.rizzui-input-container]:w-full [&_.rizzui-input-container]:px-3 md:[&_.rizzui-input-container]:px-5 xl:[&_.rizzui-input-container]:px-7"
                    inputClassName={`[&.is-focus]:border-gray-500 ring-[#CBD5E1] dark:ring-[#3B404F] [&.is-focus]:ring-2 [&.is-focus]:ring-[#CBD5E1] dark:[&.is-focus]:ring-[#3B404F] [&.is-hover]:border-0 border-0 ring-1 lg:text-base text-[#475569] dark:text-steel-100/40 ${errors.email ? '!ring-red-500' : ''}`}
                    prefix={<Envelop className="w-5 md:w-6 h-5 md:h-6" />}
                    required
                />
                {errors.email && (
                    <Text className="text-xs text-red-600 dark:text-red-400 mt-1 ml-1">
                        {errors.email}
                    </Text>
                )}
            </Box>

            {/* Password Input */}
            <Box>
                <Password
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="[&_.rizzui-input-container]:bg-white dark:[&_.rizzui-input-container]:bg-transparent [&_.rizzui-input-container]:focus:ring-gray-500 [&_.rizzui-input-container_input]:w-full lg:[&_.rizzui-input-container]:h-14 [&_.rizzui-input-container]:w-full [&_.rizzui-input-container]:px-3 md:[&_.rizzui-input-container]:px-5 xl:[&_.rizzui-input-container]:px-7"
                    inputClassName={`[&.is-focus]:border-gray-500 ring-[#CBD5E1] dark:ring-[#3B404F] [&.is-focus]:ring-2 [&.is-focus]:ring-[#CBD5E1] dark:[&.is-focus]:ring-[#3B404F] [&.is-hover]:border-0 border-0 ring-1 lg:text-base text-[#475569] dark:text-steel-100/40 ${errors.password ? '!ring-red-500' : ''}`}
                    required
                />
                {errors.password && (
                    <Text className="text-xs text-red-600 dark:text-red-400 mt-1 ml-1">
                        {errors.password}
                    </Text>
                )}
            </Box>

            {/* Forgot Password */}
            <Flex justify="end" className="pt-1">
                <Link
                    href="/auth/forgot-password"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-custom-black dark:hover:text-steel-100 hover:underline"
                >
                    Forgot password?
                </Link>
            </Flex>

            {/* Submit Button */}
            <Button
                type="submit"
                isLoading={isLoading}
                disabled={isLoading}
                className="flex font-semibold items-center justify-center w-full h-10 lg:h-14 !mt-6 text-sm lg:text-base text-white transition-all !bg-custom-black dark:!bg-steel-600 hover:dark:!bg-steel-600/80 border-0 rounded-md hover:!bg-opacity-90 focus:outline-none hover:shadow-sm disabled:opacity-50"
            >
                {isLoading ? 'Signing in...' : 'Log In'}
            </Button>

            {/* Divider */}
            <Flex align="center" className="gap-4 my-6">
                <Box className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                <Text className="text-xs text-gray-500 dark:text-gray-400">OR</Text>
                <Box className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            </Flex>

            {/* Sign Up Link */}
            <Flex justify="center" className="pt-2">
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                    Create account?{' '}
                    <Link
                        href="/auth/signup"
                        className="font-semibold text-custom-black dark:text-steel-100 hover:underline"
                    >
                        Sign Up
                    </Link>
                </Text>
            </Flex>

            {/* Magic Link Alternative */}
            {/* <Flex justify="center" className="pt-1">
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
