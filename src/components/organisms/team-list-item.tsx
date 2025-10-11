'use client';

import { Dispatch, SetStateAction, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Team, type CompleteTeam } from '@/db/schema';
import { deleteTeam } from '@/server/actions/team.action';
import { updateCurrentTeam } from '@/server/actions/user.action';
import dayjs from 'dayjs';
import { RiDeleteBinLine, RiRefreshLine } from 'react-icons/ri';
import { Avatar, Button, Modal, Popover, Text, Title } from 'rizzui';
import { toast } from 'sonner';

import { MESSAGES } from '@/config/messages';
import { PAGES } from '@/config/pages';
import { cn } from '@/lib/utils/cn';
import { handleError } from '@/lib/utils/error';
import { useIsClient } from '@/hooks/useIsClient';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Box, Flex } from '@/components/atoms/layout';

type PropType = {
  team: CompleteTeam;
  currentTeam: Team | null;
};

export const TeamListItem = ({ team, currentTeam }: PropType) => {
  const router = useRouter();
  const isExtraSmall = useMediaQuery('(max-width:539px)');
  const isClient = useIsClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTeamSwitchPending, startSwitchTeamTransition] = useTransition();
  const [isDeleteTeamPending, startDeleteTeamTransition] = useTransition();

  function handleDeleteTeam(setOpen: Dispatch<SetStateAction<boolean>>) {
    startDeleteTeamTransition(async () => {
      try {
        await deleteTeam(team.id);
        toast.success('Team deleted successfully.');
      } catch (error) {
        handleError(MESSAGES.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN_LATER);
      } finally {
        setOpen(false);
      }
    });
  }

  if (!isClient) return null;

  return (
    <Flex
      direction="col"
      className="mb-3 gap-4 py-5 border-b border-steel-100 dark:border-steel-600 last:border-0 [@media(min-width:540px)]:flex-row sm:mb-0"
    >
      <Flex
        justify="start"
        align="center"
        direction="col"
        className="sm:flex-row sm:items-center gap-2 sm:gap-4"
      >
        <Avatar
          name={team?.name as string}
          src={team.avatar as string}
          size="sm"
        />
        <div>
          <Text className="mb-1.5 font-medium text-gray-900 dark:text-gray-200 text-center sm:text-left">
            {team.name}
          </Text>
          <Text className="text-xs text-center sm:text-left">
            {dayjs(team.createdAt).format('dddd, MMMM D, YYYY h:mm A	')}
          </Text>
        </div>
      </Flex>

      <Flex className="gap-3 sm:justify-end" justify="center">
        <Button
          onClick={() =>
            startSwitchTeamTransition(() => {
              updateCurrentTeam(team.id);
              router.push(PAGES.DASHBOARD.ROOT);
            })
          }
          variant="flat"
          size="sm"
          disabled={currentTeam?.id === team.id}
        >
          <RiRefreshLine
            className={cn(
              'mr-1.5 w-4 h-auto',
              isTeamSwitchPending && 'animate-spin'
            )}
          />
          Switch Team
        </Button>

        {isExtraSmall ? (
          <>
            <Button
              aria-label="Delete Team Button"
              onClick={() => setIsModalOpen(true)}
              className="group"
              variant="flat"
              size="sm"
              color="danger"
            >
              <RiDeleteBinLine className="w-4 h-auto" />
            </Button>
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              containerClassName="bg-white dark:bg-steel-800"
            >
              <Box className="p-4">
                <Title className="mb-2 text-lg font-semibold">
                  Delete Team?
                </Title>
                <Text className="text-gray-600 dark:text-gray-300">
                  Deleting a team will result in the loss of all associated
                  data.
                </Text>
                <Flex className="gap-3 mt-6" justify="end">
                  <Button
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    isLoading={isDeleteTeamPending}
                    onClick={() => handleDeleteTeam(setIsModalOpen)}
                    variant="flat"
                    color="danger"
                  >
                    Delete
                  </Button>
                </Flex>
              </Box>
            </Modal>
          </>
        ) : (
          <Popover placement="left">
            <Popover.Trigger>
              <Button
                aria-label="Delete Team Button"
                className="group"
                variant="flat"
                size="sm"
                color="danger"
              >
                <RiDeleteBinLine className="w-4 h-auto" />
              </Button>
            </Popover.Trigger>
            <Popover.Content>
              {({ setOpen }) => (
                <>
                  <Title className="mb-2 text-lg font-semibold">
                    Delete Team?
                  </Title>
                  <Text className="text-gray-600 dark:text-gray-300 max-w-[42ch]">
                    Deleting a team will result in the loss of all associated
                    data.
                  </Text>
                  <Flex justify="end" className="gap-3 mt-6">
                    <Button onClick={() => setOpen(false)} variant="outline">
                      Cancel
                    </Button>
                    <Button
                      isLoading={isDeleteTeamPending}
                      onClick={() => handleDeleteTeam(setOpen)}
                      color="danger"
                      variant="flat"
                    >
                      Delete
                    </Button>
                  </Flex>
                </>
              )}
            </Popover.Content>
          </Popover>
        )}
      </Flex>
    </Flex>
  );
};
