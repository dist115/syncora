import { getCurrentTeam, getMyTeams } from '@/server/actions/team.action';

import { Box, Flex } from '@/components/atoms/layout';
import { PageHeader } from '@/components/atoms/page-header';
import { CreateTeamButton } from '@/components/molecules/create-team-button';
import { NoTeamFallback } from '@/components/organisms/no-team-fallback';
import { TeamListItem } from '@/components/organisms/team-list-item';

export const ShowTeams = async () => {
  const teams = await getMyTeams();
  const currentTeam = await getCurrentTeam();

  if (!teams || !teams.length) {
    return <NoTeamFallback />;
  }

  return (
    <Box>
      {teams && (
        <PageHeader
          title="Manage Teams"
          description="Manage your teams"
          titleClassName="text-lg xl:text-xl"
          childrenClassName="flex [@media(min-width:375px)]:inline-flex"
          className="items-center"
          headingWrapperClassName="[@media(min-width:375px)]:w-auto"
        >
          <Flex justify="end" className="w-full">
            <CreateTeamButton />
          </Flex>
        </PageHeader>
      )}

      {teams.map((team: any) => (
        <TeamListItem team={team} key={team.id} currentTeam={currentTeam} />
      ))}
    </Box>
  );
};
