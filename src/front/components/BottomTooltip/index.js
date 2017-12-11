import styled from 'styled-components';
import { Tooltip } from 'rebass';

export default styled(Tooltip)`
  &::before {
    bottom: -100%;
    transform: translate(-50%, 0);
  }
  &::after {
    bottom: auto;
    transform: translate(-50%, 2px);
    border-top-color: transparent;
    border-bottom-color: black;
  }
`;
