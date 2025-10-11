'use client';

import { Fragment } from 'react';
import { CompleteBreadcrumbs } from '@/db/schema';
import { isEmpty } from 'lodash';
import { ChevronRight } from 'lucide-react';

import { PAGES } from '@/config/pages';
import { cn } from '@/lib/utils/cn';
import Link from '@/components/atoms/next/link';

import { BreadcrumbsDropDown } from './breadcrumbs-dropdown';

export type BreadcrumbsType = 'link' | 'button';

interface BreadcrumbsProps {
  breadcrumbs: CompleteBreadcrumbs[];
  as?: BreadcrumbsType;
  onClick?: (value?: any) => void;
  className?: string;
}

export function Breadcrumbs({
  breadcrumbs,
  as = 'link',
  onClick,
  className,
}: BreadcrumbsProps) {
  const breadcrumbsItemClassNames =
    'inline-block items-center gap-1 text-steel-700 dark:text-steel-100 hover:underline underline-offset-2 whitespace-nowrap max-w-[33%] truncate';

  return (
    <nav
      className={cn(
        'flex items-center justify-start space-x-2 text-sm w-full',
        className
      )}
    >
      {breadcrumbs?.length > 2 ? (
        <BreadcrumbsDropDown
          breadcrumbs={breadcrumbs}
          onClick={onClick}
          as={as}
        />
      ) : (
        <>
          {as === 'link' ? (
            <Link
              className={breadcrumbsItemClassNames}
              href={PAGES.DASHBOARD.FILES}
            >
              File Manager
            </Link>
          ) : (
            <button
              className={breadcrumbsItemClassNames}
              type="button"
              onClick={onClick ? () => onClick(null) : undefined}
            >
              File Manager
            </button>
          )}
        </>
      )}

      {!isEmpty(breadcrumbs) && (
        <ChevronRight
          className="text-steel-500 dark:text-steel-400"
          strokeWidth={1.75}
          size={16}
        />
      )}

      {breadcrumbs?.slice(-3).map((item, index) => (
        <Fragment key={item.id}>
          {index > 0 && (
            <ChevronRight
              className="text-steel-500 dark:text-steel-400"
              strokeWidth={1.75}
              size={16}
            />
          )}
          {as === 'link' ? (
            <Link
              className={breadcrumbsItemClassNames}
              href={PAGES.DASHBOARD.FOLDERS + '/' + item.id}
            >
              {item.name}
            </Link>
          ) : (
            <button
              className={breadcrumbsItemClassNames}
              type="button"
              onClick={onClick ? () => onClick(item) : undefined}
            >
              {item.name}
            </button>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
