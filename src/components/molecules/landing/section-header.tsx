import { Title } from 'rizzui';

import { cn } from '@/lib/utils/cn';

type Props = {
  title: string;
  description: string;
  titleClassName?: string;
  descriptionClassName?: string;
  className?: string;
};

export function SectionHeader({
  title,
  description,
  titleClassName,
  descriptionClassName,
  className,
}: Props) {
  return (
    <div className={cn('flex flex-col gap-2 lg:gap-4 items-center', className)}>
      <Title
        as="h2"
        className={cn(
          'lg:text-[32px] text-xl md:text-2xl leading-[1.4] font-bold pt-2.5 lg:pt-6 relative after:absolute after:top-0 after:left-1/2 after:-translate-x-1/2 after:w-16 lg:after:w-24 after:h-0.5 lg:after:h-1 after:rounded-full text-custom-black after:bg-[#6493FD]',
          titleClassName
        )}
      >
        {title}
      </Title>
      <p
        className={cn(
          'text-sm lg:text-lg md:text-base text-center text-[#475569] max-w-[27ch] lg:max-w-[45ch]',
          descriptionClassName
        )}
      >
        {description}
      </p>
    </div>
  );
}
