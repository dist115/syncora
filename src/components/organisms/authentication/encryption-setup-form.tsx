'use client';


import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Text, Select } from 'rizzui';
import { toast } from 'sonner';
import { Box, Flex } from '@/components/atoms/layout';
import { Card } from '@/components/atoms/card';
import { PAGES } from '@/config/pages';
import { Shield, Key, Info } from 'lucide-react';
import { setupEncryptionAction } from '@/server/actions/encryption.action';
const ENCRYPTION_TYPES = [
    { value: 'AES-256-GCM', label: 'AES-256-GCM (Recommended)' },
];

export const EncryptionSetupForm = () => {
    const router = useRouter();
    const [userId, setUserId] = useState('');
    const [encryptionType, setEncryptionType] = useState('AES-256-GCM');
    const [userKey, setUserKey] = useState('');
    const [useGeneratedKey, setUseGeneratedKey] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const [authUserId, setAuthUserId] = useState('');
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        // ✅ CHANGED: Get authUserId instead of userId
        const id = sessionStorage.getItem('authUserId');
        const email = sessionStorage.getItem('userEmail');

        if (!id) {
            toast.error('Session expired', {
                description: 'Please sign up or login again',
                position: 'top-center',
            });
            router.push('/auth/signup');
            return;
        }

        setAuthUserId(id); // ✅ CHANGED: Store authUserId
        setUserEmail(email || '');
    }, [router]);


    const validateKey = (key: string): boolean => {
        // Must be 64 hexadecimal characters (32 bytes)
        const hexRegex = /^[0-9a-fA-F]{64}$/;
        return hexRegex.test(key);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Validate custom key if provided
        if (!useGeneratedKey) {
            if (!validateKey(userKey)) {
                toast.error('Invalid encryption key', {
                    description: 'Key must be 64 hexadecimal characters (32 bytes)',
                    duration: 4000,
                    position: 'top-center',
                });
                setIsLoading(false);
                return;
            }
        }

        try {
            const response = await setupEncryptionAction({
                authUserId,
                encryptionType,
                userProvidedKey: useGeneratedKey ? null : userKey,
            });

            if (!response.ok) {
                toast.error(response.error || 'Setup failed', {
                    duration: 4000,
                    position: 'top-center',
                });
                setIsLoading(false);
                return;
            }

            const email = sessionStorage.getItem('userEmail');

            // Clear session storage
            sessionStorage.removeItem('authUserId');
            sessionStorage.removeItem('userEmail');
            sessionStorage.removeItem('fromLogin');

            toast.success('Encryption setup complete! 🎉', {
                description: useGeneratedKey
                    ? 'Your files are now secured with encryption'
                    : 'Your encryption key has been saved',
                duration: 3000,
                position: 'top-center',
            });

           
            if (email) {
                localStorage.setItem('lastLoginEmail', email);
            }

            setTimeout(() => {
                router.push('/login'); 
            }, 1500);
        } catch (error) {
            console.error('Encryption setup error:', error);
            toast.error('An unexpected error occurred', {
                duration: 4000,
                position: 'top-center',
            });
            setIsLoading(false);
        }
    };


    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Info Card */}
            <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                <Flex align="start" className="gap-3">
                    <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <Box>
                        <Text className="text-sm text-blue-900 dark:text-blue-100 font-medium mb-1">
                            About Encryption
                        </Text>
                        <Text className="text-xs text-blue-800 dark:text-blue-200">
                            Your files will be encrypted before storage. You can either let us generate
                            a secure key or provide your own 32-byte encryption key.
                        </Text>
                    </Box>
                </Flex>
            </Card>

            {/* Encryption Type Selection */}
            <Box>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Encryption Type
                </label>
                <Select
                    value={encryptionType}
                    onChange={(value: string) => setEncryptionType(value)}
                    options={ENCRYPTION_TYPES}
                    className="w-full"
                    disabled
                />
                <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    AES-256-GCM provides military-grade encryption with authentication
                </Text>
            </Box>

            {/* Key Options */}
            <Box className="space-y-4">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Encryption Key Setup
                </Text>

                <Card
                    className={`p-4 cursor-pointer transition-all ${useGeneratedKey
                        ? 'border-2 border-custom-black dark:border-steel-500 bg-gray-50 dark:bg-steel-800'
                        : 'border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                    onClick={() => {
                        setUseGeneratedKey(true);
                        setUserKey('');
                    }}
                >
                    <Flex align="center" className="gap-3">
                        <Box className={`p-2 rounded-full ${useGeneratedKey
                            ? 'bg-custom-black dark:bg-steel-600'
                            : 'bg-gray-200 dark:bg-gray-700'
                            }`}>
                            <Shield className={`w-5 h-5 ${useGeneratedKey
                                ? 'text-white'
                                : 'text-gray-600 dark:text-gray-400'
                                }`} />
                        </Box>
                        <Box>
                            <Text className="font-semibold text-custom-black dark:text-steel-100">
                                Generate Key (Recommended)
                            </Text>
                            <Text className="text-sm text-gray-600 dark:text-gray-400">
                                We'll create a secure 256-bit encryption key for you
                            </Text>
                        </Box>
                    </Flex>
                </Card>

                <Card
                    className={`p-4 cursor-pointer transition-all ${!useGeneratedKey
                        ? 'border-2 border-custom-black dark:border-steel-500 bg-gray-50 dark:bg-steel-800'
                        : 'border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                    onClick={() => setUseGeneratedKey(false)}
                >
                    <Flex align="center" className="gap-3">
                        <Box className={`p-2 rounded-full ${!useGeneratedKey
                            ? 'bg-custom-black dark:bg-steel-600'
                            : 'bg-gray-200 dark:bg-gray-700'
                            }`}>
                            <Key className={`w-5 h-5 ${!useGeneratedKey
                                ? 'text-white'
                                : 'text-gray-600 dark:text-gray-400'
                                }`} />
                        </Box>
                        <Box>
                            <Text className="font-semibold text-custom-black dark:text-steel-100">
                                Provide Your Own Key
                            </Text>
                            <Text className="text-sm text-gray-600 dark:text-gray-400">
                                Use your own 32-byte (64 character) hexadecimal key
                            </Text>
                        </Box>
                    </Flex>
                </Card>
            </Box>

            {/* Custom Key Input */}
            {!useGeneratedKey && (
                <Box>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Encryption Key (64 hex characters)
                    </label>
                    <Input
                        type="text"
                        placeholder="e.g., a1b2c3d4e5f6..."
                        value={userKey}
                        onChange={(e) => setUserKey(e.target.value)}
                        className="font-mono text-sm"
                        required={!useGeneratedKey}
                    />
                    <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Must be exactly 64 hexadecimal characters (0-9, a-f)
                    </Text>
                </Box>
            )}

            {/* Warning Card */}
            <Card className="p-4 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
                <Flex align="start" className="gap-3">
                    <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <Box>
                        <Text className="text-sm text-amber-900 dark:text-amber-100 font-medium mb-1">
                            Important Security Notice
                        </Text>
                        <Text className="text-xs text-amber-800 dark:text-amber-200">
                            Your encryption key is essential for accessing your files. Store it securely!
                        </Text>
                    </Box>
                </Flex>
            </Card>

            <Button
                type="submit"
                isLoading={isLoading}
                className="w-full h-12 !bg-custom-black dark:!bg-steel-600"
            >
                {useGeneratedKey ? 'Generate Key & Continue' : 'Save Key & Continue'}
            </Button>
        </form>
    );
};