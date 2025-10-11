import { useEffect } from 'react';
import { create } from 'zustand';

import { setCookie } from '@/lib/utils/set-cookie';
import { FilesLayoutType } from '@/components/organisms/file-layout-switcher';

type Props = {
  layout: FilesLayoutType | undefined;
  setLayout: (value: FilesLayoutType) => void;
};

const useFilesLayoutStore = create<Props>((set, get) => ({
  layout: undefined,
  setLayout: (value: FilesLayoutType) => set({ layout: value }),
}));

export function useFilesLayout(defaultLayout?: FilesLayoutType) {
  const { layout, setLayout } = useFilesLayoutStore();

  useEffect(() => {
    if (typeof defaultLayout !== 'undefined') {
      setLayout(defaultLayout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleLayout(layout: FilesLayoutType) {
    setCookie({
      name: 'files-layout',
      value: layout,
      path: '/',
    });
    setLayout(layout);
  }

  return { layout, toggleLayout };
}
