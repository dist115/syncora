import { Text } from 'rizzui';

import { cn } from '@/lib/utils/cn';
import { Flex } from '@/components/atoms/layout';

type Props = {
  illustration: any;
  illustrationProps?: any;
  title?: string;
  subtitle?: string;
  className?: string;
  illustrationClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
};

export function Fallback({
  illustration,
  illustrationProps,
  title,
  subtitle,
  className,
  illustrationClassName,
  titleClassName,
  subtitleClassName,
}: Props) {
  const Illustration = illustration;
  return (
    <Flex direction="col" className={cn('w-auto inline-flex gap-0', className)}>
      <Illustration
        {...illustrationProps}
        className={cn(illustrationClassName)}
      />
      {!!title && (
        <Text
          className={cn(
            'mt-4 lg:mt-6 text-base font-semibold text-custom-black dark:text-slate-300 text-center',
            titleClassName
          )}
        >
          {title}
        </Text>
      )}
      {!!subtitle && (
        <Text
          className={cn(
            'mt-1.5 text-xs text-center dark:text-slate-400',
            subtitleClassName
          )}
        >
          {subtitle}
        </Text>
      )}
    </Flex>
  );
}
