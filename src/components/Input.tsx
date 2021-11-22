import React, { FC } from 'react';
import styled from 'styled-components';


const StyledInput = styled.input`
  width: 80vw;
  height: 200px;
  font-size: 10vw;
  color: #0D47A1;
  border: none;
  border-width: 0px;
  outline: none;
  background-color: #00000005;
  &:focus: {
    border: none;
    border-width: 0px;
  }
`

export interface InputProps {
  onChange: (text: string) => void;
  value: string;
}

const Input: FC<InputProps> = ({
  onChange,
  value
}) => {

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    onChange(event.target.value);
  }

  return (
    <StyledInput 
      type="text"
      onChange={handleChange}
      value={value}
      autoFocus={true}
    />
  )
}

export default Input;