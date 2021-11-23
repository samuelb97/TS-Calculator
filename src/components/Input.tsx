import React, { FC } from 'react';
import styled from 'styled-components';


const StyledInput = styled.input`
  width: 80vw;
  height: 200px;
  font-size: 6vw;
  color: #FFF;
  padding: 0px 20px;
  border: none;
  border-width: 0px;
  outline: none;
  border-radius: 10px;
  background-color: #FFF2;
  &:focus: {
    border: none;
    border-width: 0px;
  }
`

export interface InputProps {
  onChange: (text: string) => void;
  onEnter?: () => void;
  value: string;
}

const Input: FC<InputProps> = ({
  onChange,
  onEnter,
  value
}) => {

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    onChange(event.target.value);
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if(event.key === 'Enter') {
      onEnter && onEnter();
    }
  }

  return (
    <StyledInput 
      type="text"
      onChange={handleChange}
      value={value}
      autoFocus={true}
      onKeyDown={handleKeyDown}
    />
  )
}

export default Input;