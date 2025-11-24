'use client';

import React, { useState } from 'react';
import { Permission, TeamRole } from '@/db/schema';
import { updateTeamRole } from '@/server/actions/team-role.action';
import { isEmpty } from 'lodash';
import { Controller, SubmitHandler } from 'react-hook-form';
import { Button, Checkbox, CheckboxGroup, Input } from 'rizzui';
import { toast } from 'sonner';

import { MESSAGES } from '@/config/messages';
import { useDrawer } from '@/lib/store/drawer.store';
import { handleError } from '@/lib/utils/error';
import {
  CreateTeamRoleSchema,
  TeamRoleInput,
} from '@/lib/validations/team-role.schema';
import { FixedDrawerBottom } from '@/components/atoms/fixed-drawer-bottom';
import { Form } from '@/components/atoms/forms';
import { Box, Flex } from '@/components/atoms/layout';

export const UpdateRoleForm = ({
  permissions,
  role,
}: {
  permissions: Permission[];
  role: TeamRole;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { closeDrawer } = useDrawer();
  const [reset, setReset] = useState({
    role: role.name,
    permissions: role.permissions as Permission[],
  });

  const onSubmit: SubmitHandler<TeamRoleInput> = async (
    inputs: TeamRoleInput
  ) => {
    // Iterate permissions array and pull the ones that match from the inputs
    const perms = (inputs.permissions as string[])
      .map((permissionId) => {
        return permissions.find(
          (permission) => permission.action === permissionId
        );
      })
      .filter((permission) => typeof permission !== 'undefined');
    const permissionAction = perms.map((permission) => permission?.action);

    try {
      if (isEmpty(perms)) {
        throw new Error('Please select at least one permission');
      }
      setIsLoading(true);

      await updateTeamRole(role.id, {
        name: inputs.name,
        permissions: permissionAction as any,
      });
      setReset({ role: '', permissions: [] });
      toast.success(MESSAGES.ROLE_UPDATED);
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
        label: permission.action ?? '',
        value: permission.action ?? '',
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
        useFormProps={{
          defaultValues: {
            name: role.name || '',
          },
        }}
      >
        {({ register, setValue, control, formState: { errors } }) => (
          <Flex direction="col" align="stretch" className="gap-5">
            <Box>
              <Input
                type="text"
                label="Role name"
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
                      value={option.value as string}
                      key={option.label}
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
