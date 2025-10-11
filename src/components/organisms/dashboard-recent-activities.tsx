import { CompleteFile } from '@/db/schema';
import { Avatar, Text } from 'rizzui';

import { cn } from '@/lib/utils/cn';
import { formatDateToString } from '@/lib/utils/format-date';
import { BellColored } from '@/components/atoms/icons/bell-colored';
import { NoFilesIllustration } from '@/components/atoms/illustrations/fallbacks/no-files-illustration';
import { Box, Flex } from '@/components/atoms/layout';
import SimpleBar from '@/components/atoms/simplebar';
import { Fallback } from '@/components/molecules/Fallback';

export function DashboardRecentActivities({
  recentActivitiesFiles,
  currentTeamId,
  className,
}: {
  recentActivitiesFiles: CompleteFile[];
  currentTeamId: string;
  className?: string;
}) {
  return (
    <Box className={className}>
      <Text className="font-bold lg:text-lg text-custom-black dark:text-gray-200 mb-4 lg:mb-6">
        Recent Activities
      </Text>
      <Box className="border border-steel-100 dark:border-steel-600/60 rounded-xl">
        {recentActivitiesFiles.length ? (
          <SimpleBar
            className={cn(
              'w-full max-h-[341px] lg:max-h-[325px] xl:max-h-[595px] 2xl:max-h-[595px] 3xl:max-h-[600px]'
            )}
          >
            <Box>
              {recentActivitiesFiles.map((activity) => {
                return (
                  <Activity
                    key={`recent-activities-${activity.id}`}
                    currentTeamId={currentTeamId}
                    activity={activity}
                  />
                );
              })}
            </Box>
          </SimpleBar>
        ) : (
          <Box className="py-[51px]">
            <Fallback
              illustration={NoFilesIllustration}
              illustrationProps={{ fill: 'coralPink' }}
              className="w-full"
              illustrationClassName="w-56 h-auto"
              title="No Activities"
              titleClassName="mt-6"
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}

function Activity({
  activity,
  currentTeamId,
}: {
  activity: CompleteFile;
  currentTeamId: string;
}) {
  const name = (activity.user ? activity.user.name : activity.name) as string;
  const avatar =
    (activity.user?.image as string) || '/assets/avatars/avatar7.webp';

  return (
    <Flex
      align="start"
      justify="start"
      className="relative rounded-lg last-of-type:border-b-0 z-[2] p-5 3xl:p-6 border-b border-steel-100 dark:border-steel-600/60"
    >
      <Box className="w-auto h-auto shrink-0">
        {currentTeamId ? (
          <Avatar
            className="!h-8 !w-8 3xl:!h-10 3xl:!w-10 text-sm border-0"
            name={name}
            rounded="full"
            src={avatar}
          />
        ) : (
          <Text
            as="span"
            className="aspect-square rounded-full w-12 inline-flex bg-gray-100 dark:bg-slate-700/30"
          >
            <BellColored className="w-5 h-5 m-auto" />
          </Text>
        )}
      </Box>
      <Box>
        <Text>
          <Text
            as="span"
            className="font-medium text-custom-black dark:text-white"
          >
            {currentTeamId ? name : 'You'}
          </Text>{' '}
          <Text as="span" className="font-medium text-custom-gray mt-px">
            {getActionType(activity.createdAt, activity.updatedAt)} a new{' '}
            {activity.type === 'folder' ? 'folder' : 'file'}
          </Text>
        </Text>
        <Text className="">{renderFileName(activity)}</Text>
        <Text className="text-custom-gray mt-0.5">
          {formatDateToString(activity.updatedAt)}
        </Text>
      </Box>
    </Flex>
  );
}

function getActionType(createdAt: Date, updatedAt: Date) {
  if (new Date(updatedAt) == new Date(createdAt)) {
    return 'added';
  } else {
    return 'added';
  }
}

function renderFileName(file: any) {
  if (file.type === 'folder') {
    return (
      <Text as="span" className="inline-flex items-center">
        <Text
          as="span"
          className="max-w-[15ch] inline-block truncate text-custom-black dark:text-slate-400 font-medium"
        >
          {file.name}
        </Text>
      </Text>
    );
  }

  return (
    <Text
      as="span"
      className="inline-flex items-center text-custom-black dark:text-slate-400"
    >
      <Text
        as="span"
        className="max-w-[15ch] inline-block truncate text-custom-black dark:text-slate-400 font-medium"
      >
        {file.name}
      </Text>
      {`.${file.extension}`}
    </Text>
  );
}
