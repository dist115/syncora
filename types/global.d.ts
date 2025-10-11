declare global {
  namespace React {
    type FCC<P = {}> = FC<React.PropsWithChildren<P>>;
  }
}
