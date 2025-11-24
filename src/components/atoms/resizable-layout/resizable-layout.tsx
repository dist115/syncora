'use client';

import { ReactNode, useEffect } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

import { cn } from '@/lib/utils/cn';
import { setCookie } from '@/lib/utils/set-cookie';
import { ResizeIcon } from '@/components/atoms/icons/resize-icon';
import { Box } from '@/components/atoms/layout';

import { useResizableLayout } from './resizable-layout.utils';

export const panelMainContentRef = { current: null };

type Props = {
  sidebar?: ReactNode;
  children: ReactNode;
  defaultSize?: number[];
  defaultCollapsed?: boolean;
  sidebarWrapperClassName?: string;
  childrenWrapperClassName?: string;
  resizeHandlerClassName?: string;
};

export function ResizablePanel({
  defaultSize = [16, 84],
  defaultCollapsed = false,
  sidebar,
  children,
  sidebarWrapperClassName,
  childrenWrapperClassName,
  resizeHandlerClassName,
}: Props) {
  const { isCollapsed, setCollapsed } = useResizableLayout();

  function handleLayout(sizes: number[]) {
    setCookie({
      name: 'layout-resizable-panels:default-size',
      value: JSON.stringify(sizes),
      path: '/',
    });
  }

  function handleCollapsed(collapsed: boolean) {
    setCollapsed(collapsed);
    setCookie({
      name: 'layout-resizable-panels:default-collapsed',
      value: JSON.stringify(collapsed),
      path: '/',
    });
  }

  useEffect(() => {
    if (defaultCollapsed) {
      setCollapsed(defaultCollapsed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const IS_COLLAPSED = isCollapsed ?? defaultCollapsed;

  return (
    <PanelGroup direction="horizontal" onLayout={handleLayout}>
      <Panel
        defaultSize={defaultSize[0]}
        minSize={15}
        maxSize={16}
        collapsedSize={4}
        collapsible
        onCollapse={() => handleCollapsed(true)}
        onExpand={() => handleCollapsed(false)}
        className={cn(
          'transition-all sticky top-0 duration-150 min-w-[76px] ease-in-out hidden xl:inline-block h-screen',

          IS_COLLAPSED
            ? 'min-w-[76px] max-w-[76px]'
            : 'min-w-[300px] max-w-[300px]'
        )}
      >
        <div className={cn('h-full', sidebarWrapperClassName)}>{sidebar}</div>
      </Panel>
      <PanelResizeHandle
        className={cn(
          'w-px relative z-10 hidden xl:flex items-center justify-center',
          resizeHandlerClassName
        )}
      >
        <button
          aria-label="resizable-button"
          className="rounded-full px-0.5 py-1.5 -mt-20 bg-gray-200 dark:bg-slate-400 duration-200 hover:shadow-md text-black dark:text-slate-700 cursor-e-resize"
        >
          <ResizeIcon className="w-3 auto" />
        </button>
      </PanelResizeHandle>
      <Panel defaultSize={defaultSize[1]}>
        <Box
          ref={panelMainContentRef}
          className={cn('h-screen overflow-y-auto', childrenWrapperClassName)}
        >
          {children}
        </Box>
      </Panel>
    </PanelGroup>
  );
}
