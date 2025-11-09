import { Metadata } from 'next';
import { LoginForm } from '@/components/organisms/authentication/login-form';
import { Box, Text } from 'rizzui';

export const metadata: Metadata = {
  title: 'Sign In | Syncora',
  description: 'Sign in to your Syncora account',
};

export default function PasswordLoginPage() {
  return (
    <Box className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-steel-900 py-12 px-4 sm:px-6 lg:px-8">
      <Box className="max-w-md w-full space-y-8 bg-white dark:bg-steel-800 p-8 rounded-lg shadow-lg">
        <Box className="text-center">
          <Text className="text-3xl font-bold text-custom-black dark:text-steel-100">
            Welcome Back
          </Text>
          <Text className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to your account
          </Text>
        </Box>
        
        <LoginForm />
      </Box>
    </Box>
  );
}