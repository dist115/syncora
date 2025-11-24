import React from 'react';

export function Section(props: React.HTMLAttributes<HTMLElement>) {
  const { children, ...rest } = props;
  return <section {...rest}>{children}</section>;
}
