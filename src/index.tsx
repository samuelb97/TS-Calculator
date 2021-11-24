import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import Container from './components/Container';
import Description from "./components/Description";
import Input from './components/Input';
import ResultText from './components/ResultText';

import Calculator from "./utils/Calculator";

const App = () => {
  const [text, setText] = useState<string>(''); // Holds value of calculator input
  const [result, setResult] = useState<string>('') // Holds result from calculation to render


  useEffect(() => {
    if(text) {
      const result = Calculator.calculate(text);
      setResult(`${result}`)
    } else {
      setResult('');
    }
  }, [text])


  return (
    <Container>
      <Description />
      <Input onChange={setText}  value={text} />
      <ResultText>{result}</ResultText>
    </Container>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);