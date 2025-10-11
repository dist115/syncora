'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { CompleteUser, type CompleteTeam } from '@/db/schema';
import { updateCurrentTeam } from '@/server/actions/user.action';
import { Placement } from '@floating-ui/react';
import { RiArrowDownSLine } from 'react-icons/ri';
import { Avatar, Button, Dropdown } from 'rizzui';

import { PAGES } from '@/config/pages';
import { cn } from '@/lib/utils/cn';

import { TeamMenus } from './team-menus';

type CurrentTeamType = {
  id: string;
  name: string;
  [key: string]: any;
};

export default function SwitchTeam({
  teams,
  currentTeam,
  user,
  placement = 'right',
  nameClassName,
  arrowClassName,
  buttonClassName,
}: {
  teams: CompleteTeam[];
  currentTeam: CurrentTeamType | null;
  user: Partial<CompleteUser>;
  placement?: Placement;
  nameClassName?: string;
  arrowClassName?: string;
  buttonClassName?: string;
}) {
  const pathname = usePathname();
  const userAvatarFallback = '/assets/avatars/avatar7.webp';
  const teamAvatarFallback = '/assets/avatars/avatar8.webp';

  const currentName = currentTeam?.name ?? (user?.name as string);

  const handleTeamSwitching = async (id: string | null) => {
    await updateCurrentTeam(id ?? null);
  };

  useEffect(() => {
    if (teams.length) {
      if (
        currentTeam !== null &&
        (pathname === PAGES.SETTINGS.USER.PROFILE ||
          pathname === PAGES.SETTINGS.USER.BILLING ||
          pathname === PAGES.SETTINGS.USER.TEAMS)
      ) {
        handleTeamSwitching(null);
      } else if (
        currentTeam === null &&
        (pathname === PAGES.SETTINGS.TEAM.ROOT ||
          pathname === PAGES.SETTINGS.TEAM.MEMBERS ||
          pathname === PAGES.SETTINGS.TEAM.ROLES ||
          pathname === PAGES.SETTINGS.TEAM.BILLING)
      ) {
        handleTeamSwitching(teams[0].id);
      } else {
        handleTeamSwitching(currentTeam?.id as string);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Dropdown
      className={'block'}
      placement={placement}
      key={currentTeam?.id || user?.id}
    >
      <Dropdown.Trigger
        as="button"
        aria-label="Switch Team Button"
        className="w-full"
      >
        <Button
          as="span"
          variant="text"
          className={cn(
            'flex items-center justify-between w-full px-2 cursor-pointer group text-steel-700 hover:text-steel-900 dark:text-white dark:group-hover:text-white/80 ring-offset-black dark:ring-offset-white focus-visible:ring-steel-600',
            buttonClassName
          )}
        >
          <span className="flex items-center gap-2.5">
            <Avatar
              name={`Profile Picture of ${currentName}` as string}
              src={
                currentTeam?.name
                  ? currentTeam?.avatar || teamAvatarFallback
                  : user?.image || userAvatarFallback
              }
              customSize={30}
              rounded="sm"
              className="ring-1 ring-muted ring-offset-background text-white ring-offset-2 [&_img]:ring-steel-200"
            />
            <span
              className={cn(
                'max-w-[15ch] truncate overflow-x-hidden',
                nameClassName
              )}
            >
              {currentName}
            </span>
          </span>
          <RiArrowDownSLine
            size={20}
            className={cn(
              'ml-2 -mr-1 text-steel-400 group-hover:text-steel-900 dark:text-white dark:group-hover:text-white/80',
              arrowClassName
            )}
          />
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Menu className="w-[240px]  dark:bg-steel-700 bg-white rounded-lg dark:border-steel-600 drop-shadow-none border-steel-200/60">
        <TeamMenus teams={teams} user={user} currentTeamId={currentTeam?.id!} />
      </Dropdown.Menu>
    </Dropdown>
  );
}
