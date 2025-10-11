import { create } from 'zustand';

import { PermissionObject } from '../utils/permission';

type PermissionProps = {
  permissions: PermissionObject[];
  setPermissions: (permissions: PermissionObject[]) => void;
};

export const usePermissionStore = create<PermissionProps>((set) => ({
  permissions: [],
  setPermissions: (permissions: PermissionObject[]) => set({ permissions }),
}));