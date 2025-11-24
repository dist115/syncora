'use client';

import { useEffect, useState } from 'react';

import { PermissionNameType } from '@/config/permission';
import { ModuleNameType } from '@/config/permission/common';
import { usePermissionStore } from '@/lib/store/permission.store';
import { createAbility, PermissionObject } from '@/lib/utils/permission';

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loader?: React.ReactNode;
  access: PermissionNameType;
  mod: ModuleNameType;
  rules?: PermissionObject[];
};

const Allow: React.FC<Props> = ({
  children,
  access,
  mod,
  fallback,
  loader,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const { permissions } = usePermissionStore();
  const ability = createAbility(permissions);

  if (ability.can(access, mod)) return <>{children}</>;

  if (loading && loader) return <>{loader}</>;

  if (!loading && fallback) return <>{fallback}</>;
  return null;
};

export default Allow;
