import Calculator from "./Calculator";

test("Calculater: isOperand", () => {
  expect(Calculator.isOperand('0')).toBe(true);
  expect(Calculator.isOperand('.')).toBe(true);
  expect(Calculator.isOperand('+')).toBe(false);
  expect(Calculator.isOperand('-')).toBe(false);
  expect(Calculator.isOperand('p')).toBe(false);
})

test('Calculator: isOperator', () => {
  expect(Calculator.isOperator('0')).toBe(false);
  expect(Calculator.isOperator('.')).toBe(false);
  expect(Calculator.isOperator('+')).toBe(true);
  expect(Calculator.isOperator('-')).toBe(true);
  expect(Calculator.isOperator('k')).toBe(false);
})

test('Calculator: processOperand', () => {
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
  Calculator.parse('3 + - 4 * -2 / ( 1 - 5 ) ^ 2 ^ 3');
  expect(Calculator.outputStack).toStrictEqual([ 3, -4, -2, '*', 1, 5, '-', 2, 3, '^', '^', '/', '+']);
  Calculator.reset();

  Calculator.parse('3 + 4');
  expect(Calculator.outputStack).toStrictEqual([ 3, 4, '+']);
  Calculator.reset();
})

test('Calculator: calculate', () => {
  expect(Calculator.calculate('3 + 4')).toBe(7);
  expect(Calculator.calculate('3 - 10')).toBe(-7);
  expect(Calculator.calculate('3 * 4')).toBe(12);
  expect(Calculator.calculate('10 / 4')).toBe(2.5);
  expect(Calculator.calculate('2 ^ 4')).toBe(16);
  expect(Calculator.calculate('1.3 + 7.6')).toBe(8.9);

  expect(Calculator.calculate('3 + - 4 * -2 / ( 1 - 5 )')).toBe(1);
  expect(Calculator.calculate('2^(3 + 2^4) * - 2 + 9 * -.1')).toBe(-1048576.9);
})