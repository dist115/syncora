import React from 'react';

import { Title } from 'rizzui';
import { Flex } from '../atoms/layout';

const NoPermission = () => {
  return (
    <Flex justify="center" align="center" className="py-16">
      <Title>Do not have permission to view this page</Title>
    </Flex>
  );
};

export default NoPermission;
