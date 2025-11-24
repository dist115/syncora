import { ReactNode } from 'react';

export const FixedDrawerBottom = ({ children }: { children: ReactNode }) => {
  return (
    <div className="absolute bottom-0 right-0 z-10 w-full bg-white border-t dark:bg-steel-800 dark:border-steel-600 border-steel-100">
      <div className="flex items-center w-full gap-4 px-6 py-5 bg-steel-50/30 dark:bg-steel-700">
        {children}
      </div>
    </div>
  );
};
