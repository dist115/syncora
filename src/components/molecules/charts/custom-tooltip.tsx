import { TooltipProps } from 'recharts';
import {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';
import { Text } from 'rizzui';

import { addSpacesToCamelCase } from '@/lib/utils/addSpacesToCamelCase';
import { cn } from '@/lib/utils/cn';
import { formatFileSize } from '@/lib/utils/formatFileSize';
import { formatNumber } from '@/lib/utils/formatNumber';

function isValidHexColor(colorCode: string) {
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexColorRegex.test(colorCode);
}

export interface CustomTooltipProps extends TooltipProps<ValueType, NameType> {
  prefix?: string;
  postfix?: string;
  className?: string;
  formattedNumber?: boolean;
  render?: (v: any) => JSX.Element;
}

export function CustomTooltip({
  label,
  prefix,
  active,
  postfix,
  payload,
  className,
  formattedNumber,
  render,
}: CustomTooltipProps) {
  if (!active) return null;

  return (
    <div
      className={cn(
        'rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 shadow-2xl dark:bg-slate-700',
        className
      )}
    >
      <Text className="label mb-0.5 block bg-gray-100 p-2 px-2.5 text-center font-lexend text-xs font-semibold capitalize text-gray-600 dark:text-gray-200 dark:bg-slate-600/80 ">
        {label}
      </Text>
      <div className="px-3 py-1.5 text-xs">
        {payload?.map((item: any, index: number) => {
          return (
            <div
              key={item.dataKey + index}
              className="chart-tooltip-item flex items-center py-1.5"
            >
              <span
                className="me-1.5 h-2 w-2 rounded-full"
                style={{
                  backgroundColor: isValidHexColor(item.fill)
                    ? item.fill === '#fff'
                      ? item.stroke
                      : item.fill
                    : item.stroke,
                }}
              />
              <Text>
                <Text
                  as="span"
                  className="capitalize data-key-text text-gray-900 dark:text-gray-400"
                >
                  {addSpacesToCamelCase(item.dataKey)}:
                </Text>{' '}
                <Text
                  as="span"
                  className="font-medium text-gray-900 dark:text-gray-300 "
                >
                  {prefix && prefix}
                  {render ? render(item.value) : item.value}
                  {postfix && postfix}
                </Text>
              </Text>
            </div>
          );
        })}
      </div>
    </div>
  );
}
