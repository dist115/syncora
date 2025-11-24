'use client';

import { FileUsageReport } from '@/server/dto/files.dto';
import useMedia from 'react-use/lib/useMedia';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { formatFileSize } from '@/lib/utils/formatFileSize';
import { NoStorageUsedIllustration } from '@/components/atoms/illustrations/fallbacks/no-storage-used-illustration';
import SimpleBar from '@/components/atoms/simplebar';

import { Flex } from '../atoms/layout';
import { CustomTooltip } from './charts/custom-tooltip';
import { Fallback } from './Fallback';

function CustomYAxisTick({ x, y, payload }: any) {
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="end" className="fill-gray-500">
        {formatFileSize(payload.value)}
      </text>
    </g>
  );
}

export default function StorageReport({
  data,
  totalUsed,
  className,
}: {
  data: FileUsageReport[];
  totalUsed: number;
  className?: string;
}) {
  const isTablet = useMedia('(max-width: 800px)', false);
  const formattedData = data.map((item: FileUsageReport) => {
    return {
      ...item,
      image: +item.image,
      video: +item.video,
      document: +item.document,
      music: +item.music,
    };
  });

  return (
    <SimpleBar>
      <div className="h-[380px] w-full min-w-[800px] pt-9 relative">
        <ResponsiveContainer
          width="100%"
          height="100%"
          {...(isTablet && { minWidth: '800px' })}
        >
          <BarChart
            data={formattedData}
            barSize={32}
            margin={{
              left: 16,
            }}
            className="[&_.recharts-tooltip-cursor]:fill-opacity-20 [&_.recharts-rectangle.recharts-tooltip-cursor]:!opacity-0 dark:[&_.recharts-tooltip-cursor]:fill-opacity-10 [&_.recharts-cartesian-axis-tick-value]:fill-gray-500 [&_.recharts-cartesian-axis.yAxis]:-translate-y-3 rtl:[&_.recharts-cartesian-axis.yAxis]:-translate-x-12 [&_.recharts-cartesian-grid-vertical]:opacity-0"
          >
            <CartesianGrid strokeDasharray="8 10" strokeOpacity={0.435} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={<CustomYAxisTick />}
            />
            {!!totalUsed && (
              <Tooltip
                content={
                  <CustomTooltip
                    render={(v: number) => <>{formatFileSize(v)}</>}
                  />
                }
              />
            )}
            <Bar dataKey="image" stackId="a" fill="#2633CA" />
            <Bar dataKey="video" stackId="a" fill="#4052F6" />
            <Bar dataKey="music" stackId="a" fill="#97C0FF" />
            <Bar dataKey="document" stackId="a" fill="#DDEAFC" />
          </BarChart>
        </ResponsiveContainer>
        {!totalUsed && (
          <div className="absolute h-full w-full top-0 left-0">
            <Flex justify="center">
              <Fallback
                illustration={NoStorageUsedIllustration}
                illustrationClassName="w-[400px] h-auto"
                title="No Storage Used"
                subtitle="Please start uploading files"
                className="mt-8"
              />
            </Flex>
          </div>
        )}
      </div>
    </SimpleBar>
  );
}
