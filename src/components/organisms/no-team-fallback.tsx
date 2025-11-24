'use client';

import { Button } from 'rizzui';

import { useDrawer } from '@/lib/store/drawer.store';
import { NoTeamIllustration } from '@/components/atoms/illustrations/fallbacks/no-team-illustration';
import { Flex } from '@/components/atoms/layout';
import { Fallback } from '@/components/molecules/Fallback';
import { CreateTeamForm } from '@/components/organisms/forms/create-team-form';

const title = 'Create Team';
const description = 'Create a new team to collaborate with your team member.';

export function NoTeamFallback({
  fallbackText,
  hideButton = true,
}: {
  fallbackText?: string;
  hideButton?: boolean;
}) {
  const { openDrawer } = useDrawer();
  return (
    <Flex direction="col" className="gap-3 py-12">
      <Flex justify="center">
        <Fallback
          illustration={NoTeamIllustration}
          illustrationClassName="w-[700px] h-auto"
          title={fallbackText ?? 'You have no team'}
        />
      </Flex>
      {hideButton && (
        <Button
          onClick={() => openDrawer(CreateTeamForm, title, description)}
          rounded="pill"
          className="px-8"
        >
          Create Team
        </Button>
      )}
    </Flex>
  );
}
