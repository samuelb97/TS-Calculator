import React, { useState } from "react";
import ReactDOM from "react-dom";

import Container from './components/Container';
import Input from './components/Input';
import Button from './components/Button';
import ResultText from './components/ResultText';

import Calculator from "./utils/Calculator";

const App = () => {
  const [text, setText] = useState<string>(''); // Holds value of calculator input
  const [result, setResult] = useState<string>('') // Holds result from calculation to render

  const calculate = () => {
    console.log('calculate()');
    try {
      const result = Calculator.parse(text);
      setResult(text + result);
    } catch(err) {
      setResult('Invalid Expression');
    }
  }

  return (
    <Container>
      <Input onChange={setText} value={text} />
      <Button onClick={calculate}>Calculate</Button>
      <ResultText>Result: {result}</ResultText>
    </Container>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);