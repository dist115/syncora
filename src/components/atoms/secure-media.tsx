'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { Text } from 'rizzui';
import { Flex } from './layout';

/**
 * Fetches encrypted files with credentials before use
 * Works for images, videos, audio, PDFs, documents
 */
function useFetchSecureFile(src: string) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) return;

    let objectUrl: string;

    // ✅ Fetch file with credentials (sends session cookies)
    fetch(src, {
      credentials: 'include', // Critical: Send cookies for authentication
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load file: ${response.status}`);
        }
        return response.blob();
      })
      .then((blob) => {
        // Create object URL from blob
        objectUrl = URL.createObjectURL(blob);
        setFileUrl(objectUrl);
        setLoading(false);
      })
      .catch((err) => {
        console.error('❌ Secure file fetch error:', err);
        setError(true);
        setLoading(false);
      });

    // Cleanup: Revoke object URL to prevent memory leaks
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [src]);

  return { fileUrl, loading, error };
}

/**
 * Loading spinner component
 */
function LoadingSpinner({ className }: { className?: string }) {
  return (
    <Flex justify="center" className={cn('w-full h-full', className)}>
      <Text
        as="span"
        className="rounded-full h-12 w-12 border border-t-0 border-r-0 border-[#0F172A] dark:border-white animate-spin"
      />
    </Flex>
  );
}

/**
 * Error display component
 */
function ErrorDisplay({ message }: { message: string }) {
  return (
    <Flex
      justify="center"
      align="center"
      className="w-full h-full bg-steel-100 dark:bg-steel-700"
    >
      <Text className="text-steel-500 dark:text-steel-400">{message}</Text>
    </Flex>
  );
}

/**
 * SecureImage Component
 * Fetches encrypted images with credentials before displaying
 */
export function SecureImage({
  src,
  alt,
  className,
  onLoad,
}: {
  src: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
}) {
  const { fileUrl, loading, error } = useFetchSecureFile(src);

  useEffect(() => {
    if (fileUrl && onLoad) {
      onLoad();
    }
  }, [fileUrl, onLoad]);

  if (error) {
    return <ErrorDisplay message="Failed to load image" />;
  }

  if (loading || !fileUrl) {
    return <LoadingSpinner />;
  }

  return <img src={fileUrl} alt={alt} className={className} />;
}

/**
 * SecureVideo Component
 * Fetches encrypted videos with credentials before displaying
 */
export function SecureVideo({
  src,
  className,
  type = 'video/mp4',
}: {
  src: string;
  className?: string;
  type?: string;
}) {
  const { fileUrl, loading, error } = useFetchSecureFile(src);

  if (error) {
    return <ErrorDisplay message="Failed to load video" />;
  }

  if (loading || !fileUrl) {
    return <LoadingSpinner />;
  }

  return (
    <video controls className={className}>
      <source src={fileUrl} type={type} />
      Your browser does not support the video tag.
    </video>
  );
}

/**
 * SecureAudio Component
 * Fetches encrypted audio with credentials before displaying
 */
export function SecureAudio({
  src,
  className,
  type,
}: {
  src: string;
  className?: string;
  type?: string;
}) {
  const { fileUrl, loading, error } = useFetchSecureFile(src);

  if (error) {
    return <ErrorDisplay message="Failed to load audio" />;
  }

  if (loading || !fileUrl) {
    return <LoadingSpinner />;
  }

  return (
    <audio controls className={className}>
      <source src={fileUrl} type={type} />
      Your browser does not support the audio tag.
    </audio>
  );
}

/**
 * SecureDocument Component
 * Fetches encrypted documents with credentials
 * Returns the secure blob URL for use with DocViewer or iframe
 */
export function SecureDocument({
  src,
  children,
}: {
  src: string;
  children: (props: {
    fileUrl: string | null;
    loading: boolean;
    error: boolean;
  }) => React.ReactNode;
}) {
  const { fileUrl, loading, error } = useFetchSecureFile(src);

  return <>{children({ fileUrl, loading, error })}</>;
}