'use client';

import { usePathname } from 'next/navigation';
import { CompleteUser, Team } from '@/db/schema';
import { updateCurrentTeam } from '@/server/actions/user.action';
import { isEmpty } from 'lodash';
import { useRouter } from 'next-nprogress-bar';
import { RiAddLine, RiCheckLine } from 'react-icons/ri';
import { Avatar, Button, Dropdown, Text } from 'rizzui';
import SimpleBar from 'simplebar-react';

import { PAGES } from '@/config/pages';
import { useDrawer } from '@/lib/store/drawer.store';
import { cn } from '@/lib/utils/cn';
import { getR2FileLink } from '@/lib/utils/file';
import { CreateTeamForm } from '@/components/organisms/forms/create-team-form';

const title = 'Create Team';
const description = 'Create a new team to collaborate with your team member.';

export const TeamMenus = ({
  teams,
  currentTeamId,
  user,
}: {
  teams: Team[];
  currentTeamId: string;
  user: Partial<CompleteUser>;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { openDrawer } = useDrawer();

  const teamImagePlaceholder = '/assets/avatars/avatar8.webp';
  const userImage = user?.image
    ? getR2FileLink(user?.image)
    : '/assets/avatars/avatar7.webp';

  const handleTeamSwitching = async (
    event: React.MouseEvent<any, MouseEvent>,
    team: any
  ) => {
    event.preventDefault();
    await updateCurrentTeam(team?.id);
    if (pathname !== PAGES.DASHBOARD.ROOT) {
      router.push(PAGES.DASHBOARD.ROOT);
    }
  };

  return (
    <>
      <SimpleBar className="max-h-[315px]">
        <Text className="px-3 pt-1 pb-2 text-sm text-steel-500 dark:text-steel-400">
          Personal Account
        </Text>
        <Dropdown.Item
          activeClassName="bg-steel-100/70 dark:bg-steel-600/50"
          onClick={(event) => handleTeamSwitching(event, { id: null })}
        >
          <Avatar
            customSize={32}
            name={user?.name as string}
            src={userImage}
            className="text-sm me-2"
          />
          <Text
            as="span"
            className={cn(
              'truncate text-steel-800 text-[15px] dark:text-steel-50',
              !currentTeamId && 'font-medium'
            )}
          >
            {user.name}
          </Text>
          {!currentTeamId && (
            <RiCheckLine className="w-4 h-auto ml-auto text-steel-900 dark:text-steel-100" />
          )}
        </Dropdown.Item>

        {!isEmpty(teams) && (
          <>
            <Text className="px-3 py-1 mt-3 text-sm text-steel-500 dark:text-steel-400">
              Teams
            </Text>

            {teams.map((team: Team) => {
              return (
                <Dropdown.Item
                  activeClassName="bg-steel-100/70 dark:bg-steel-600/50"
                  key={team.id}
                  onClick={(event) => handleTeamSwitching(event, team)}
                >
                  <Avatar
                    customSize={32}
                    name={team.name!}
                    src={
                      team.avatar === null
                        ? teamImagePlaceholder
                        : getR2FileLink(team.avatar)
                    }
                    className="text-sm text-white me-2"
                  />
                  <Text
                    as="span"
                    className={cn(
                      'truncate text-steel-800 text-[15px] dark:text-steel-50',
                      currentTeamId === team.id && 'font-medium'
                    )}
                  >
                    {team.name}
                  </Text>
                  {currentTeamId === team.id && (
                    <Text as="span" className="pl-2 ml-auto">
                      <RiCheckLine className="min-w-4 h-auto text-steel-900 dark:text-steel-100" />
                    </Text>
                  )}
                </Dropdown.Item>
              );
            })}
          </>
        )}
      </SimpleBar>
      <Dropdown.Item
        activeClassName="bg-transparent"
        onClick={() => openDrawer(CreateTeamForm, title, description)}
        className="mt-1.5 py-2.5"
      >
        <Button
          as="span"
          size="md"
          rounded="lg"
          className="w-full bg-steel-100/70 dark:bg-steel-600/50 text-steel-900 hover:bg-steel-200/50 dark:text-steel-200  dark:hover:bg-steel-600/70"
        >
          <RiAddLine className="text-steel-900 dark:text-steel-200 w-5 h-auto me-1.5" />
          {isEmpty(teams) ? 'Create Team' : 'Add New Team'}
        </Button>
      </Dropdown.Item>
    </>
  );
};
