import { ElementType } from 'react';
import { create } from 'zustand';

type DrawerProps = {
  open: boolean;
  title: string;
  description?: string;
  component: any;
  props?: Object;
  openDrawer: (
    component: ElementType,
    title?: string,
    description?: string,
    props?: Object
  ) => void;
  closeDrawer: () => void;
};

export const useDrawer = create<DrawerProps>((set, get) => ({
  title: '',
  description: '',
  open: false,
  component: null,
  props: {},
  openDrawer: (component, title, description, props) =>
    set({ open: true, component, title, description, props }),
  closeDrawer: () => set({ open: false, component: null, props: {} }),
}));

type DrawerStateProps = {
  open: boolean;
  openDrawer: (props?: Object) => void;
  closeDrawer: () => void;
  props: Object;
};

export const useDrawerState = create<DrawerStateProps>((set, get) => ({
  open: false,
  props: {},
  openDrawer: (props) => set({ open: true, props }),
  closeDrawer: () => set({ open: false, props: {} }),
}));
