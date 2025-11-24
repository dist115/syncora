import { useEffect } from 'react';
import { create } from 'zustand';

type Props = {
  isCollapsed: boolean | undefined;
  setCollapsed: (value: boolean) => void;
};

const useResizableLayoutStore = create<Props>((set, get) => ({
  isCollapsed: undefined,
  setCollapsed: (value: boolean) => set({ isCollapsed: value }),
}));

export function useResizableLayout(defaultValue?: boolean) {
  const { isCollapsed, setCollapsed } = useResizableLayoutStore();

  useEffect(() => {
    if (typeof defaultValue !== 'undefined') {
      setCollapsed(defaultValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isCollapsed, setCollapsed };
}
