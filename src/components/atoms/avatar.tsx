import { memo } from 'react';

import { env } from '@/env.mjs';
import { cn } from '@/lib/utils/cn';
import Image from '@/components/atoms/next/image';

const sizes = {
  xs: 'w-[20px] h-[20px] rounded',
  sm: 'w-[30px] h-[30px] rounded-lg',
  md: 'w-[45px] h-[45px] rounded-xl',
  lg: 'w-[60px] h-[60px] rounded-2xl',
};
const fontSizes = {
  xs: 'text-sm',
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-2xl',
};
const initialsFontSizes = {
  xs: ['text-[9px]', 'text-sm'],
  sm: ['text-[13px]', 'text-xl'],
  md: ['text-lg', 'text-2xl'],
  lg: ['text-2xl', 'text-4xl'],
};

const letterWithColors = [
  { string: ['a', 'n'], color: '#ff8b8b' },
  { string: ['b', 'o'], color: '#61bfad' },
  { string: ['c', 'p'], color: '#112378' },
  { string: ['d', 'q'], color: '#776ea7' },
  { string: ['e', 'r'], color: '#ef3e4a' },
  { string: ['f', 's'], color: '#22BCA0' },
  { string: ['g', 't'], color: '#e88565' },
  { string: ['h', 'u'], color: '#4770FF' },
  { string: ['i', 'v'], color: '#40DFEF' },
  { string: ['j', 'w'], color: '#f9dc5c' },
  { string: ['k', 'x'], color: '#83BD75' },
  { string: ['l', 'y'], color: '#bf211e' },
  { string: ['m', 'z'], color: '#69a197' },
];

const defaultBG = '#4770FF';

function DummyUserImg(props: React.SVGAttributes<{}>) {
  return (
    <svg
      viewBox="-42 0 512 512.002"
      xmlns="http://www.w3.org/2000/svg"
      id="fi_1077114"
      fill="currentColor"
      {...props}
    >
      <path d="m210.351562 246.632812c33.882813 0 63.222657-12.152343 87.195313-36.128906 23.972656-23.972656 36.125-53.304687 36.125-87.191406 0-33.875-12.152344-63.210938-36.128906-87.191406-23.976563-23.96875-53.3125-36.121094-87.191407-36.121094-33.886718 0-63.21875 12.152344-87.191406 36.125s-36.128906 53.308594-36.128906 87.1875c0 33.886719 12.15625 63.222656 36.132812 87.195312 23.976563 23.96875 53.3125 36.125 87.1875 36.125zm0 0"></path>
      <path d="m426.128906 393.703125c-.691406-9.976563-2.089844-20.859375-4.148437-32.351563-2.078125-11.578124-4.753907-22.523437-7.957031-32.527343-3.308594-10.339844-7.808594-20.550781-13.371094-30.335938-5.773438-10.15625-12.554688-19-20.164063-26.277343-7.957031-7.613282-17.699219-13.734376-28.964843-18.199219-11.226563-4.441407-23.667969-6.691407-36.976563-6.691407-5.226563 0-10.28125 2.144532-20.042969 8.5-6.007812 3.917969-13.035156 8.449219-20.878906 13.460938-6.707031 4.273438-15.792969 8.277344-27.015625 11.902344-10.949219 3.542968-22.066406 5.339844-33.039063 5.339844-10.972656 0-22.085937-1.796876-33.046874-5.339844-11.210938-3.621094-20.296876-7.625-26.996094-11.898438-7.769532-4.964844-14.800782-9.496094-20.898438-13.46875-9.75-6.355468-14.808594-8.5-20.035156-8.5-13.3125 0-25.75 2.253906-36.972656 6.699219-11.257813 4.457031-21.003906 10.578125-28.96875 18.199219-7.605469 7.28125-14.390625 16.121094-20.15625 26.273437-5.558594 9.785157-10.058594 19.992188-13.371094 30.339844-3.199219 10.003906-5.875 20.945313-7.953125 32.523437-2.058594 11.476563-3.457031 22.363282-4.148437 32.363282-.679688 9.796875-1.023438 19.964844-1.023438 30.234375 0 26.726562 8.496094 48.363281 25.25 64.320312 16.546875 15.746094 38.441406 23.734375 65.066406 23.734375h246.53125c26.625 0 48.511719-7.984375 65.0625-23.734375 16.757813-15.945312 25.253906-37.585937 25.253906-64.324219-.003906-10.316406-.351562-20.492187-1.035156-30.242187zm0 0"></path>
    </svg>
  );
}

function backgroundColor(signature: string) {
  if (!signature) return undefined;
  const currObj = letterWithColors.filter((obj) =>
    obj.string.includes(signature?.charAt(0).toLowerCase())
  );
  return currObj[0]?.color ?? defaultBG;
}

function getInitialsFromName(name: string | undefined, maxInitials: number) {
  if (!name) return null;
  const matches = name?.replace(/([^\p{L}\s]*\p{L})\p{L}*/gu, '$1');

  if (!matches) {
    return null;
  }

  if (maxInitials > 1 && matches?.length > 1) {
    return matches[0] + matches[matches?.length - 1];
  }

  return matches[0];
}

interface AvatarProps {
  name?: string | null;
  src?: string | null;
  size?: keyof typeof sizes;
  color?: string;
  className?: string;
  avatarClassName?: string;
  nameClassName?: string;
  displayName?: boolean;
  rounded?: boolean;
  maxInitials?: 1 | 2;
}

const Avatar: React.FC<AvatarProps> = ({
  size = 'sm',
  className,
  src,
  name,
  nameClassName,
  avatarClassName,
  displayName = false,
  maxInitials = 1,
  rounded = true,
}) => {
  const signature = name && getInitialsFromName(name, maxInitials);
  let imageUrl = src;

  if (!name && !src) {
    return (
      <span
        className={cn(
          'font-inter img flex shrink-0 items-center justify-center font-semibold relative uppercase overflow-hidden text-white',
          sizes[size],
          maxInitials === 2
            ? initialsFontSizes[size][0]
            : initialsFontSizes[size][1],
          {
            'rounded-full': rounded,
          },
          avatarClassName
        )}
        style={{
          backgroundColor: defaultBG,
        }}
      >
        <DummyUserImg className="w-3/4 text-current absolute -bottom-0.5" />
      </span>
    );
  }

  if (src) {
    if (src?.startsWith('http') === false && env.NEXT_PUBLIC_UPLOAD_URL) {
      imageUrl = `${env.NEXT_PUBLIC_UPLOAD_URL}/${src}`;
    }
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {src ? (
        <div
          className={cn(
            'flex items-center justify-center overflow-hidden shrink-0 bg-gray-200 relative',
            sizes[size],
            {
              'rounded-full': rounded,
            },
            avatarClassName
          )}
        >
          <Image
            src={imageUrl ?? ''}
            alt="Avatar"
            fill={true}
            sizes="auto"
            className="object-cover w-full h-full"
          />
        </div>
      ) : (
        <span
          className={cn(
            'font-inter flex shrink-0 items-center justify-center font-semibold uppercase text-white',
            sizes[size],
            maxInitials === 2
              ? initialsFontSizes[size][0]
              : initialsFontSizes[size][1],
            {
              'rounded-full': rounded,
            },
            avatarClassName
          )}
          style={{
            backgroundColor: name
              ? backgroundColor(signature as string)
              : defaultBG,
          }}
        >
          {signature}
        </span>
      )}

      {displayName && name !== '' && (
        <span
          className={cn(
            'overflow-hidden text-ellipsis text-gray-800',
            fontSizes[size],
            nameClassName
          )}
          title={name as string}
        >
          {name}
        </span>
      )}
    </div>
  );
};

Avatar.displayName = 'Avatar';
export default memo(Avatar);
