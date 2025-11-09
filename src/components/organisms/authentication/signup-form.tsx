'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Password, Text } from 'rizzui';
import { toast } from 'sonner';
import { signupAction } from '@/server/actions/password-auth.action';
import { Box, Flex } from '@/components/atoms/layout';
import Link from '@/components/atoms/next/link';
import { PAGES } from '@/config/pages';

export const SignupForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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
      const response = await signupAction(formData);

      if (!response.ok) {
        toast.error(response.error || 'Signup failed', {
          duration: 4000,
          position: 'top-center',
        });
        setIsLoading(false);
        return;
      }

      toast.success('Account created successfully!', {
        description: 'Please check your email to verify your account.',
        duration: 5000,
        position: 'top-center',
      });
      
      // Store email for next step
    localStorage.setItem('lastLoginEmail', formData.email); // ADD THIS
    
    // Redirect to password login
    setTimeout(() => {
      router.push('/auth/login?message=signup-success'); // CHANGE THIS
    }, 1000);
    } catch (error) {
      console.error('Signup error:', error);
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
          name="name"
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="[&_.rizzui-input-container]:bg-white dark:[&_.rizzui-input-container]:bg-transparent [&_.rizzui-input-container]:focus:ring-gray-500 [&_.rizzui-input-container_input]:w-full lg:[&_.rizzui-input-container]:h-14 [&_.rizzui-input-container]:w-full [&_.rizzui-input-container]:px-3 md:[&_.rizzui-input-container]:px-5 xl:[&_.rizzui-input-container]:px-7"
          inputClassName="[&.is-focus]:border-gray-500 ring-[#CBD5E1] dark:ring-[#3B404F] [&.is-focus]:ring-2 [&.is-focus]:ring-[#CBD5E1] dark:[&.is-focus]:ring-[#3B404F] [&.is-hover]:border-0 border-0 ring-1 lg:text-base text-[#475569] dark:text-steel-100/40"
          required
        />
      </Box>

      <Box>
        <Input
          name="email"
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="[&_.rizzui-input-container]:bg-white dark:[&_.rizzui-input-container]:bg-transparent [&_.rizzui-input-container]:focus:ring-gray-500 [&_.rizzui-input-container_input]:w-full lg:[&_.rizzui-input-container]:h-14 [&_.rizzui-input-container]:w-full [&_.rizzui-input-container]:px-3 md:[&_.rizzui-input-container]:px-5 xl:[&_.rizzui-input-container]:px-7"
          inputClassName="[&.is-focus]:border-gray-500 ring-[#CBD5E1] dark:ring-[#3B404F] [&.is-focus]:ring-2 [&.is-focus]:ring-[#CBD5E1] dark:[&.is-focus]:ring-[#3B404F] [&.is-hover]:border-0 border-0 ring-1 lg:text-base text-[#475569] dark:text-steel-100/40"
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

      <Box>
        <Password
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="[&_.rizzui-input-container]:bg-white dark:[&_.rizzui-input-container]:bg-transparent [&_.rizzui-input-container]:focus:ring-gray-500 [&_.rizzui-input-container_input]:w-full lg:[&_.rizzui-input-container]:h-14 [&_.rizzui-input-container]:w-full [&_.rizzui-input-container]:px-3 md:[&_.rizzui-input-container]:px-5 xl:[&_.rizzui-input-container]:px-7"
          inputClassName="[&.is-focus]:border-gray-500 ring-[#CBD5E1] dark:ring-[#3B404F] [&.is-focus]:ring-2 [&.is-focus]:ring-[#CBD5E1] dark:[&.is-focus]:ring-[#3B404F] [&.is-hover]:border-0 border-0 ring-1 lg:text-base text-[#475569] dark:text-steel-100/40"
          required
        />
      </Box>

      <Box className="pt-2">
        <Text className="text-xs text-gray-600 dark:text-gray-400">
          Password must be at least 8 characters and include uppercase, lowercase, number, and special character.
        </Text>
      </Box>

      <Button
        type="submit"
        isLoading={isLoading}
        className="flex font-semibold items-center justify-center w-full h-10 lg:h-14 !mt-5 text-sm lg:text-base text-white transition-all !bg-custom-black dark:!bg-steel-600 hover:dark:!bg-steel-600/80 border-0 rounded-md hover:!bg-opacity-90 focus:outline-none hover:shadow-sm"
      >
        Create Account
      </Button>

      <Flex justify="center" className="pt-4">
        <Text className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            href={PAGES.AUTH.PASSWORD_LOGIN}
            className="font-semibold text-custom-black dark:text-steel-100 hover:underline"
          >
            Log In
          </Link>
        </Text>
      </Flex>
    </form>
  );
};