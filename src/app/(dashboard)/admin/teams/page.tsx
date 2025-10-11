import { getAllTeams } from '@/server/actions/team.action';

import { Flex } from '@/components/atoms/layout';
import { PageHeader } from '@/components/atoms/page-header';
import { AllTeamsTable } from '@/components/organisms/all-teams-table';

export default async function Page({ searchParams }: { searchParams: any }) {
  const { teams, count } = await getAllTeams(searchParams);

  return (
    <>
      <Flex direction="col" align="stretch" className="gap-0">
        <PageHeader
          title="Teams"
          description="Manage teams"
          titleClassName="text-xl"
        />

        <AllTeamsTable teams={teams}  totalTeams={count} />
      </Flex>
    </>
  );
}
