'use client';

import { CompleteUser, type CompleteTeam } from '@/db/schema';

import { cn } from '@/lib/utils/cn';
import { Box } from '@/components/atoms/layout';
import { useResizableLayout } from '@/components/atoms/resizable-layout/resizable-layout.utils';
import SwitchTeam from '@/components/molecules/switch-team/switch-team';

type CurrentTeamType = {
  id: string;
  name: string;
  [key: string]: any;
};

export function SidebarSwitchTeam({
  teams,
  currentTeam,
  user,
  defaultCollapsed = false,
}: {
  teams: CompleteTeam[];
  currentTeam: CurrentTeamType | null;
  user: Partial<CompleteUser>;
  defaultCollapsed?: boolean;
}) {
  const { isCollapsed } = useResizableLayout(defaultCollapsed);

  const IS_COLLAPSED = isCollapsed ?? defaultCollapsed;
  return (
    <Box className={cn('w-full ', IS_COLLAPSED ? 'px-2 mb-2' : 'px-7 mb-4')}>
      <Box
        className={cn(
          'border rounded-lg bg-[#F1F5F9] border-custom-border/30 dark:bg-steel-600/50 dark:border-steel-600',
          !IS_COLLAPSED && 'p-1'
        )}
      >
        <SwitchTeam
          user={user}
          currentTeam={currentTeam}
          teams={teams as CompleteTeam[]}
          placement={IS_COLLAPSED ? 'right-end' : 'top'}
          nameClassName={cn(IS_COLLAPSED && 'hidden')}
          arrowClassName={cn(IS_COLLAPSED && 'hidden')}
          buttonClassName={cn(IS_COLLAPSED && 'flex justify-center h-12')}
        />
      </Box>
    </Box>
  );
}
