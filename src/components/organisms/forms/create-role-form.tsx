'use client';

import React, { useState } from 'react';
import { Permission } from '@/db/schema';
import { createTeamRole } from '@/server/actions/team-role.action';
import { isEmpty } from 'lodash';
import { Controller, SubmitHandler } from 'react-hook-form';
import { Button, Checkbox, CheckboxGroup, Input } from 'rizzui';
import { toast } from 'sonner';

import { MESSAGES } from '@/config/messages';
import { useDrawer } from '@/lib/store/drawer.store';
import { handleError, hasError, showErrorMessage } from '@/lib/utils/error';
import {
  CreateTeamRoleSchema,
  TeamRoleInput,
} from '@/lib/validations/team-role.schema';
import { FixedDrawerBottom } from '@/components/atoms/fixed-drawer-bottom';
import { Form } from '@/components/atoms/forms';
import { Box, Flex } from '@/components/atoms/layout';

export const CreateRoleForm = ({
  permissions,
}: {
  permissions: Permission[];
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { closeDrawer } = useDrawer();
  const [reset, setReset] = useState({});

  const onSubmit: SubmitHandler<TeamRoleInput> = async (
    inputs: TeamRoleInput
  ) => {
    const perms = inputs.permissions.map((permissionId) => {
      return permissions.find(
        (permission) => permission.id === Number(permissionId)
      );
    });

    const permissionAction = perms.map((permission) => permission?.action);
    setIsLoading(true);
    try {
      if (isEmpty(permissionAction)) {
        throw new Error('Please select at least one permission');
      }
      const newTeamRole = await createTeamRole({
        name: inputs.name,
        permissions: permissionAction as any,
      });
      if (hasError(newTeamRole)) {
        showErrorMessage(newTeamRole);
        return;
      }
      setReset({ role: '', permissions: [], teamId: '' });
      toast.success(MESSAGES.ADDED_NEW_ROLE);
      closeDrawer();
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const [filteredPermissions, setFilteredPermissions] =
    useState<Permission[]>(permissions);

  const options = React.useMemo(() => {
    return filteredPermissions.map((permission) => {
      return {
        label: permission.action,
        value: permission.id.toString(),
      };
    });
  }, [filteredPermissions]);

  const handlePermissionSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value;
    const filtered = permissions.filter((permission) => {
      const permissionAction = permission.action
        ?.split('_')
        .join(' ')
        .toLowerCase();
      return permissionAction?.toLowerCase().includes(search.toLowerCase());
    });
    setFilteredPermissions(filtered);
  };

  return (
    <Flex direction="col" align="stretch" className="gap-0 p-6 pb-24">
      <Form<TeamRoleInput>
        validationSchema={CreateTeamRoleSchema}
        resetValues={reset}
        onSubmit={onSubmit}
      >
        {({ register, setValue, control, formState: { errors } }) => (
          <Flex direction="col" align="stretch" className="gap-5">
            <Box>
              <Input
                type="text"
                label="Role Name"
                placeholder="Enter role name"
                {...register('name')}
                error={errors.name?.message}
              />
            </Box>

            <Input
              type="text"
              placeholder="Search Permissions"
              onChange={handlePermissionSearch}
            />

            <Controller
              name="permissions"
              control={control}
              defaultValue={[]}
              render={({ field: { onChange, value } }) => (
                <CheckboxGroup
                  setValues={onChange}
                  values={value as string[]}
                  className="space-y-5"
                >
                  {options.map((option) => (
                    <Checkbox
                      value={option.value}
                      key={option.value}
                      name={`${option.value}`}
                      label={option.label}
                    />
                  ))}
                </CheckboxGroup>
              )}
            />

            <FixedDrawerBottom>
              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={closeDrawer}
              >
                Cancel
              </Button>

              <Button
                isLoading={isLoading}
                type="submit"
                size="lg"
                className="w-full"
              >
                Save
              </Button>
            </FixedDrawerBottom>
          </Flex>
        )}
      </Form>
    </Flex>
  );
};
