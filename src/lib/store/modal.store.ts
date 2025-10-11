import { ElementType } from 'react';
import { create } from 'zustand';

type ModalProps = {
  open: boolean;
  title: string;
  description?: string;
  component: any;
  props?: Object;
  openModal: (
    component: ElementType,
    title?: string,
    description?: string,
    props?: Object
  ) => void;
  closeModal: () => void;
};

export const useModal = create<ModalProps>((set, get) => ({
  title: '',
  description: '',
  open: false,
  component: null,
  props: {},
  openModal: (component, title, description, props) =>
    set({ open: true, component, title, description, props }),
  closeModal: () => set({ open: false, component: null, props: {} }),
}));
