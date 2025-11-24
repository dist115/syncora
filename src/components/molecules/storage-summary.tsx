'use client';

import { Cell, Label, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { Text } from 'rizzui';

import { cn } from '@/lib/utils/cn';
import {
  calculatePercentage,
  formatFileSize,
} from '@/lib/utils/formatFileSize';
import { Box, Flex } from '@/components/atoms/layout';

const COLORS = ['#0EB981', 'none'];
const legendColors = ['#0EB981', '#d8d8d8'];

function CustomLabel(props: any) {
  const { cx, cy } = props.viewBox;
  return (
    <>
      <text
        x={cx}
        y={cy - 5}
        className="recharts-text recharts-label mb-1.5"
        textAnchor="middle"
        dominantBaseline="central"
      >
        <tspan
          alignmentBaseline="middle"
          className="text-xl lg:text-[28px] font-semibold fill-[#0F172A] dark:fill-[#CBD5E1]"
        >
          {formatFileSize(props.value1)}
        </tspan>
      </text>
      <text
        x={cx}
        y={cy + 26}
        className="recharts-text recharts-label"
        textAnchor="middle"
        dominantBaseline="central"
      >
        <tspan
          className="scale-50 lg:scale-100 fill-[#0F172A] dark:fill-[#CBD5E1]"
          fontSize="14px"
        >
          {props.value2}
        </tspan>
      </text>
    </>
  );
}

export default function StorageSummary({
  className,
  totalUsed,
  totalStorage,
}: {
  totalUsed: number;
  className?: string;
  totalStorage: number;
}) {
  const availableStorage = totalStorage - totalUsed;

  const total = totalUsed + availableStorage;

  const data = [
    { name: 'Used', value: totalUsed },
    { name: 'Available', value: availableStorage },
  ];
  return (
    <Box>
      <Box className="h-[353px] 2xl:h-[388px] w-full @sm:py-3 relative before:absolute before:w-[238px] before:aspect-square before:rounded-full before:border-[24px] before:bg-transparent dark:before:bg-transparent before:border-[#F0F0F0] dark:before:border-gray-600/40 before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 scale-90 3xl:scale-100">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart className="[&_.recharts-layer:focus]:outline-none [&_.recharts-sector:focus]:outline-none dark:[&_.recharts-text.recharts-label]:first-of-type:fill-white">
            <Pie
              data={data}
              cornerRadius={40}
              innerRadius={94.7}
              outerRadius={118.5}
              paddingAngle={0}
              fill="#BFDBFE"
              stroke="rgba(0,0,0,0)"
              dataKey="value"
            >
              <Label
                width={30}
                position="center"
                content={
                  <CustomLabel
                    value1={totalUsed}
                    value2={`Used of ${formatFileSize(totalStorage)}`}
                  />
                }
              />
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#64B6F6" />
                <stop offset="70%" stopColor="#265093" />
                <stop offset="100%" stopColor="#234C90" />
              </linearGradient>
            </defs>
          </PieChart>
        </ResponsiveContainer>
      </Box>
      <Box>
        <Flex
          direction="col"
          align="start"
          className="[@media(min-width:375px)]:flex-row sm:flex-row [@media(min-width:375px)]:gap-5 [@media(min-width:375px)]:justify-center sm:justify-center lg:!flex-col 2xl:!flex-row sm:gap-5 3xl:flex-row gap-3 lg:!gap-2.5  px-4 pb-4 lg:px-5 lg:pb-5 xl:px-6 3xl:justify-between"
        >
          {data.map((item, index) => (
            <Flex
              key={item.name}
              className={cn(
                'w-auto',
                index === 0 &&
                  'pr-2.5 border-r border-gray-400 dark:border-gray-500'
              )}
            >
              <Flex align="center" justify="start" className="gap-2.5 w-auto">
                <Text
                  as="span"
                  className="h-1.5 lg:h-2 w-1.5 lg:w-2 rounded-full"
                  style={{ backgroundColor: legendColors[index] }}
                />{' '}
                <Text
                  as="span"
                  className="whitespace-nowrap lg:text-base text-custom-black dark:text-slate-400 font-medium"
                >
                  {calculatePercentage(item.value, total).toFixed(2)}%
                </Text>
                <Text
                  as="span"
                  className="lg:text-base text-custom-black dark:text-slate-400 font-medium"
                >
                  {item.name}
                </Text>
              </Flex>
            </Flex>
          ))}
        </Flex>
      </Box>
    </Box>
  );
}
