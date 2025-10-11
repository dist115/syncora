import { Text } from 'rizzui';

import { cn } from '@/lib/utils/cn';
import { Box } from '@/components/atoms/layout';

export function ArrowAnimated({
  className,
  direction = 'up',
}: {
  className?: string;
  direction: 'up' | 'down';
}) {
  return (
    <Box className={cn('aspect-[44.14/38.78]', className)}>
      <Box className="relative w-full h-full">
        <Text as="span" className={cn('w-1/2 absolute left-[25%]')}>
          {direction === 'up' ? (
            <ArrowUp className="w-full h-auto animate-arrow-bounce" />
          ) : (
            <ArrowDown className="w-full h-auto [animation-delay:500ms] animate-arrow-bounce" />
          )}
        </Text>
        <ArrowBottomGround className="w-full h-auto absolute left-0 bottom-0" />
      </Box>
    </Box>
  );
}

function ArrowUp(props: React.SVGAttributes<{}>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 29"
      fill="none"
      {...props}
    >
      <path
        fill="#fff"
        d="M3.038 14.51a2.293 2.293 0 0 1-1.605-3.922L12.206 0l10.599 10.597a2.292 2.292 0 1 1-3.237 3.245l-7.39-7.389-7.536 7.398a2.283 2.283 0 0 1-1.604.66Z"
      />
      <path
        fill="#fff"
        d="M12.114 28.71a2.292 2.292 0 0 1-2.292-2.291V3.227a2.292 2.292 0 0 1 4.585 0V26.42a2.292 2.292 0 0 1-2.293 2.292Z"
      />
    </svg>
  );
}

function ArrowDown(props: React.SVGAttributes<{}>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 23 29"
      fill="none"
      {...props}
    >
      <path
        fill="#fff"
        d="M11.182 28.493.583 17.887A2.291 2.291 0 0 1 3.82 14.65l7.39 7.388 7.536-7.407a2.293 2.293 0 0 1 3.209 3.273L11.182 28.493Z"
      />
      <path
        fill="#fff"
        d="M11.087 27.775a2.292 2.292 0 0 1-2.292-2.291V2.291a2.292 2.292 0 0 1 4.584 0v23.192a2.291 2.291 0 0 1-2.292 2.291Z"
      />
    </svg>
  );
}

function ArrowBottomGround(props: React.SVGAttributes<{}>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 45 20"
      fill="none"
      {...props}
    >
      <path
        fill="#fff"
        d="M38.948 19.72H4.933A4.942 4.942 0 0 1 0 14.798V2.44a2.291 2.291 0 0 1 4.584 0v12.357a.348.348 0 0 0 .349.339h34.015a.614.614 0 0 0 .614-.614V2.44a2.291 2.291 0 0 1 4.584 0v12.082a5.197 5.197 0 0 1-5.198 5.197Z"
      />
    </svg>
  );
}
