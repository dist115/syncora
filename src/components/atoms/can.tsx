'user client';

import React from 'react';

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  I: any;
  a: any;
  ability: any;
};

const Can: React.FC<Props> = ({ children, I, a, ability, fallback }) => {
  if (ability?.can(I, a)) return <>{children}</>;
  if (fallback) return <>{fallback}</>;
  return null;
};

export default Can;
