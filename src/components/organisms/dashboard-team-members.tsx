'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { CompleteTeamMember } from '@/db/schema';
import { getTeamMembers } from '@/server/actions/team.action';
import ContentLoader, { IContentLoaderProps } from 'react-content-loader';
import { Avatar, Badge, Text } from 'rizzui';

import { handleError } from '@/lib/utils/error';
import { formatDateToString } from '@/lib/utils/format-date';
import { Box, Flex } from '@/components/atoms/layout';
import { SearchBox } from '@/components/atoms/search-box';
import SimpleBar from '@/components/atoms/simplebar';

export function DashboardTeamMembers({
  currentTeamId,
}: {
  currentTeamId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [teamMembers, setTeamMembers] = useState<CompleteTeamMember[]>([]);

  async function fetchTeamMembers(text: string) {
    try {
      startTransition(async () => {
        const { members } = await getTeamMembers(currentTeamId, {
          text: text,
          page: 1,
          size: 10,
        });
        setTeamMembers(members);
      });
    } catch (e: any) {
      handleError(e);
    }
  }

  function handleOnSubmit(value: string) {
    fetchTeamMembers(value);
  }

  function handleOnClear() {
    fetchTeamMembers('');
  }

  useEffect(() => {
    fetchTeamMembers('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box>
      <Text className="font-bold text-lg text-custom-black dark:text-gray-200  mb-3 lg:mb-6">
        Team Members
      </Text>
      <Box className="p-6 2xl:p-8 pb-[22px] border border-[#CBD5E1]/30 rounded-xl">
        <SearchBox
          className="w-full mb-6"
          name="text"
          onClear={handleOnClear}
          placeholder="Search team members"
          inputClassName="h-10"
          onSubmit={handleOnSubmit}
          defaultValue=""
          queryParams=""
        />
        <SimpleBar className="max-h-[305px] w-[calc(100%_+_20px)] pr-[22px]">
          <Box className="space-y-4">
            {isPending ? (
              <>
                <Loader className="w-full h-auto" />
                <Loader className="w-full h-auto" />
                <Loader className="w-full h-auto" />
                <Loader className="w-full h-auto" />
                <Loader className="w-full h-auto" />
                <Loader className="w-full h-auto" />
              </>
            ) : (
              <>
                {teamMembers.map((member) => {
                  return <MemberCard key={member?.id} member={member} />;
                })}
                {teamMembers.map((member) => {
                  return <MemberCard key={member?.id} member={member} />;
                })}
              </>
            )}
          </Box>
        </SimpleBar>
      </Box>
    </Box>
  );
}

function MemberCard({ member }: { member: CompleteTeamMember }) {
  return (
    <Flex justify="start" className="gap-4">
      <Box className="relative">
        <Box className="h-12 w-12 inline-block [&_.rizzui-avatar-initials]:!rounded-lg">
          <Avatar
            className="rounded-lg !h-12 !w-12 text-sm"
            name={(member.user ? member.user.name : member.name) as string}
            src={member.user?.image as string}
            size="sm"
          />
        </Box>
        <Badge
          className="absolute top-0 -right-1 w-4 h-4 px-0 py-0 border-[3px] border-white shadow-md"
          renderAsDot
          color={
            member.status === 'Active'
              ? 'success'
              : member.status === 'Invited'
                ? 'warning'
                : 'danger'
          }
        />
      </Box>
      <Flex direction="col" justify="center" align="start" className="gap-0.5">
        <Text className="font-medium text-custom-black dark:text-gray-200">
          {member.user ? member.user.name : member.name}
        </Text>
        <Text className="dark:text-gray-400">
          Joined as <b className="font-semibold">{member.role?.description}</b>
        </Text>
      </Flex>
      {isNew(member.createdAt) && (
        <Badge className="ms-auto bg-[#BEF264] font-medium text-custom-black  rounded py-1 px-2">
          New
        </Badge>
      )}
    </Flex>
  );
}

function Loader(props: IContentLoaderProps) {
  return (
    <ContentLoader
      viewBox="0 0 449 48"
      speed={1}
      backgroundColor="#dbdbdb"
      foregroundColor="#999"
      {...props}
    >
      <rect x="0" y="0" rx="6" ry="6" width="48" height="48" />
      <rect x="66" y="7" rx="2" ry="2" width="46" height="11" />
      <rect x="66" y="30" rx="2" ry="2" width="220" height="11" />
      <rect x="409" y="14" rx="2" ry="2" width="40" height="20" />
    </ContentLoader>
  );
}

function isNew(databaseDate: Date): boolean {
  const databaseDateTime = new Date(databaseDate);

  const now = new Date();

  const differenceInMs = now.getTime() - databaseDateTime.getTime();

  const daysDifference = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

  return daysDifference <= 7;
}
