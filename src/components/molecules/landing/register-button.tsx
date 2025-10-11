import Image from 'next/image';
import AngularGradient from '@/assets/angular-gradient.webp';
import { Text } from 'rizzui';

import { cn } from '@/lib/utils/cn';
import Link from '@/components/atoms/next/link';

export function RegisterButton({ className }: { className?: string }) {
  return (
    <Link
      href={'/login'}
      className={cn(
        'inline-flex items-center justify-center px-10 py-4 font-medium bg-[#141D25] group rounded-lg text-white relative overflow-hidden border border-white/20 duration-200 hover:border-white/40 lg:text-base',
        className
      )}
    >
      <Text
        as="span"
        className="absolute select-none top-0 left-1/2 pointer-events-none z-0 -translate-x-1/2 w-full h-1.2"
      >
        <Image
          src={AngularGradient}
          alt="angular-gradient"
          className="w-full full"
          width={100}
          height={60}
          loading="lazy"
        />
      </Text>
      <Text as="span">Register</Text>
    </Link>
  );
}
