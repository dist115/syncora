import { cn } from '@/lib/utils/cn';

export function GradientBorder({
  radius = 8,
  borderWidth = 2,
  className,
  gradient,
  children,
}: {
  children?: React.ReactNode;
  className?: string;
  radius?: number;
  borderWidth?: number;
  gradient?: string;
}) {
  const variables = {
    '--radius': radius,
    '--border': borderWidth,
    '--border-px': `${borderWidth}px`,
    '--gradient': gradient ?? 'linear-gradient(to bottom, #8E77E4,#6945ED)',
  };
  const Component = 'div';

  return (
    <Component
      style={variables as React.CSSProperties}
      className={cn(
        'gradient-border-wrapper relative w-auto inline-block p-[var(--border-px)]',
        className
      )}
    >
      <Component className="gradient-border-inner w-full">
        <span className="gradient-border absolute top-0 left-0 w-full h-full z-10" />
        {children && (
          <Component className="relative z-20">{children}</Component>
        )}
      </Component>
    </Component>
  );
}
