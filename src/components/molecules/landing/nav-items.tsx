import Link from 'next/link';
import { navMenuItems } from '@/data/landing-data';
import { Text } from 'rizzui';

import { cn } from '@/lib/utils/cn';

type Props = {
  className?: string;
  linkClassName?: string;
  onClose?: () => void;
};

export default function NavItems({ className, linkClassName, onClose }: Props) {
  return (
    <nav className={cn('flex items-center gap-3', className)}>
      <ul className="flex items-center gap-8">
        {navMenuItems.map((item) => (
          <li key={`nav-menu-link-${item.href}`}>
            <Link
              href={item.href}
              className={cn(
                'cursor-pointer text-base font-geist hover:opacity-80 text-gray-50 transition',
                linkClassName
              )}
              {...(onClose && { onClick: onClose })}
            >
              <Text
                as="span"
                className="flex items-center gap-2 group-hover:[text-shadow:_0_0_0px_#0f172a] transition-all"
              >
                {item.title}
              </Text>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
