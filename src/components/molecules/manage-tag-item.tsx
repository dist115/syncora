import { useState } from 'react';
import { Tags } from '@/db/schema';
import { CheckIcon, PencilIcon, XIcon } from 'lucide-react';
import { ActionIcon, Button, Input, Popover, Text, Title } from 'rizzui';

import { Card } from '../atoms/card';
import { Flex } from '../atoms/layout';

interface Props {
  tag: Tags;
  onEdit: (id: string, value: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const ManageTagItem = ({ tag, onEdit, onDelete }: Props) => {
  const [showInput, setShowInput] = useState(false);
  const [value, setValue] = useState(tag.label);

  const onSaveEdit = async () => {
    setShowInput(false);
    if (value === tag.label || !value) return;
    await onEdit(tag.id, value);
  };

  const handleDelete = async () => {
    await onDelete(tag.id);
  };

  if (showInput) {
    return (
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        inputClassName="py-2 pl-4 pr-1 min-h-[46px]"
        suffix={
          <ActionIcon variant="flat" size="sm" onClick={onSaveEdit}>
            <CheckIcon size={16} strokeWidth={1.75} />
          </ActionIcon>
        }
      />
    );
  }
  return (
    <Card className="py-2 pl-4 pr-1">
      <Flex justify="between">
        <Text className="w-full text-steel-700 dark:text-steel-100">
          {tag.label}
        </Text>
        <Flex justify="end" className="gap-1.5">
          <ActionIcon
            variant="flat"
            size="sm"
            onClick={() => setShowInput(true)}
          >
            <PencilIcon size={14} strokeWidth={1.5} />
          </ActionIcon>

          <Popover placement="left-start">
            <Popover.Trigger>
              <ActionIcon variant="flat" size="sm" color="danger">
                <XIcon size={16} strokeWidth={1.5} />
              </ActionIcon>
            </Popover.Trigger>
            <Popover.Content>
              {({ setOpen }) => (
                <div className="w-56">
                  <Title className="mb-2 text-xl">Delete the tag?</Title>
                  <Text>Are you sure you want to delete the tag?</Text>
                  <div className="flex justify-end gap-3 mb-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setOpen(false)}
                    >
                      No
                    </Button>
                    <Button
                      size="sm"
                      variant="flat"
                      color="danger"
                      onClick={handleDelete}
                    >
                      Yes
                    </Button>
                  </div>
                </div>
              )}
            </Popover.Content>
          </Popover>
        </Flex>
      </Flex>
    </Card>
  );
};

export default ManageTagItem;
