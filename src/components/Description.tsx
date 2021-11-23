import React, { FC } from 'react';
import styled from 'styled-components';

const Wrapper = styled.p`
  color: #FFF;
  font-size: 3vw;
  height: 40px;
`

const Description: FC = () => (
  <Wrapper>
    Type a mathematical expression in the input below to calculate
  </Wrapper>
)

export default Description;