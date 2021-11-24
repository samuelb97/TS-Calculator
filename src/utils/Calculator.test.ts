import Calculator from "./Calculator";

test("Calculater: isOperand", () => {
  expect(Calculator.isOperand('0')).toBe(true);
  expect(Calculator.isOperand('.')).toBe(true);
  expect(Calculator.isOperand('+')).toBe(false);
  expect(Calculator.isOperand('-')).toBe(false);
  expect(Calculator.isOperand('p')).toBe(false);
  expect(Calculator.isOperand('')).toBe(false);
})

test('Calculator: isOperator', () => {
  expect(Calculator.isOperator('0')).toBe(false);
  expect(Calculator.isOperator('.')).toBe(false);
  expect(Calculator.isOperator('+')).toBe(true);
  expect(Calculator.isOperator('-')).toBe(true);
  expect(Calculator.isOperator('k')).toBe(false);
  expect(Calculator.isOperator('')).toBe(false);
})

test('Calculator: isLetter', () => {
  expect(Calculator.isLetter('0')).toBe(false);
  expect(Calculator.isLetter('p')).toBe(true);
  expect(Calculator.isLetter('+')).toBe(false);
  expect(Calculator.isLetter('')).toBe(false);
  expect(Calculator.isLetter('k')).toBe(true);
  expect(Calculator.isLetter('S')).toBe(true);
})

test('Calculator: isFunction', () => {
  expect(Calculator.isFunction('sint')).toBe(false);
  expect(Calculator.isFunction('cos')).toBe(true);
  expect(Calculator.isFunction('sqrt')).toBe(true);
  expect(Calculator.isFunction('posfj')).toBe(false);
  expect(Calculator.isFunction('tan')).toBe(true);
  expect(Calculator.isFunction('ln')).toBe(true);
})


test('Calculator: processOperand', () => {
  Calculator.reset();
  Calculator.processOperand('4.32')
  expect(Calculator.outputStack[0]).toBe(4.32);
  Calculator.reset();

  Calculator.processOperand('.02')
  expect(Calculator.outputStack[0]).toBe(.02);
  Calculator.reset();

  Calculator.processOperand('101')
  expect(Calculator.outputStack[0]).toBe(101);
  Calculator.reset();

  Calculator.processOperand('0')
  expect(Calculator.outputStack[0]).toBe(0);
  Calculator.reset();
})

test('Calculator: parse', () => {
  Calculator.reset();
  Calculator.parse('3 + - 4 * -2 / ( 1 - 5 ) ^ 2 ^ 3');
  expect(Calculator.outputStack).toStrictEqual([ 3, -4, -2, '*', 1, 5, '-', 2, 3, '^', '^', '/', '+']);
  Calculator.reset();

  Calculator.parse('3 + 4');
  expect(Calculator.outputStack).toStrictEqual([ 3, 4, '+']);
  Calculator.reset();
})


test('Calculator: calculate', () => {
  Calculator.reset();
  expect(Calculator.calculate('3 + 4')).toBe(7);
  expect(Calculator.calculate('3 - 10')).toBe(-7);
  expect(Calculator.calculate('3 * 4')).toBe(12);
  expect(Calculator.calculate('10 / 4')).toBe(2.5);
  expect(Calculator.calculate('2 ^ 4')).toBe(16);
  expect(Calculator.calculate('1.3 + 7.6')).toBe(8.9);
  expect(Calculator.calculate('3 + - 4 * -2 / ( 1 - 5 )')).toBe(1);
  expect(Calculator.calculate('2^(3 + 2^4) * - 2 + 9 * -.1')).toBe(-1048576.9);
  expect(Calculator.calculate('3(4 - 1)')).toBe(9);
  expect(Calculator.calculate('(5)(4)(3)')).toBe(60)
  expect(Calculator.calculate('(4 - 1)9')).toBe(27);

  expect(Calculator.calculate('log(100)')).toBe(2);
  expect(Calculator.calculate('ln(9)')).toBeCloseTo(2.19722457734);
  expect(Calculator.calculate('(log(1000 - 900) + 2) * 6')).toBe(24);

  expect(Calculator.calculate('sqrt(81)')).toBe(9);
  expect(Calculator.calculate('sin(8)')).toBeCloseTo(0.9893);
  expect(Calculator.calculate('cos(-90)')).toBeCloseTo(-0.44807);
  expect(Calculator.calculate('tan(71)')).toBeCloseTo(-3.07762);
  


  expect(Calculator.calculate('(7 +1) * sqrt(72) / cos(5 -3^9) * log(5098)')).toBeCloseTo(424.606324);
  

  expect(Calculator.calculate('log*')).toBe('Syntax Error');

  expect(Calculator.calculate('/log4')).toBe('Syntax Error');

  expect(Calculator.calculate('5 - - 10')).toBe(15);
  expect(Calculator.calculate('5 - - - 10')).toBe('Syntax Error');
})