import React from 'react';
import styled from 'styled-components';
import { Text } from 'rebass';

const Icon = styled(Text)`
  line-height: 0;
`;

const ToolbarIcon = ({ children, ...props }) => (
  <Icon f={4} {...props}>{children}</Icon>
);

export default ToolbarIcon;
