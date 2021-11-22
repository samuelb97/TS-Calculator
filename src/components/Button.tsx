import React, { FC } from 'react';
import styled from 'styled-components';


const StyledButton = styled.button`
  width: 80vw;
  height: 200px;
  font-size: 3vw;
  color: #0D47A1;
  border: none;
  border-width: 0px;
  outline: none;
  background-color: transparent;
  cursor: pointer;
  &:focus: {
    border: none;
    border-width: 0px;
  }
`

export interface ButtonProps {
  onClick: () => void;
}

const Button: FC<ButtonProps> = ({
  onClick,
  children
}) => {

  return (
    <StyledButton onClick={onClick}>
      {children}
    </StyledButton>
  )
}

export default Button;