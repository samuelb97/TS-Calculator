import _ from 'lodash';

export type OutputStackOperator = '+' | '-' | '*' | '/' | '^';
export type OperatorStackOperator = OutputStackOperator | '(' | ')';

export type OrderOfOperations = {
  [key in OutputStackOperator]: {
    precedence: number;
    associativity: 'left' | 'right'
  }
}

export type OutputStackToken = OutputStackOperator | number;

class Calculator {
  private negativeFlag: boolean;
  private lastToken: string; 
  private iterator: number;
  public outputStack: OutputStackToken[];
  private operatorStack: OperatorStackOperator[];

  public static ORDER_OF_OPERATIONS: OrderOfOperations = {
    '+': {
      precedence: 2,
      associativity: 'left'
    },
    '-': {
      precedence: 2,
      associativity: 'left'
    },
    '*': {
      precedence: 3,
      associativity: 'left'
    },
    '/': {
      precedence: 3,
      associativity: 'left'
    },
    '^': {
      precedence: 4,
      associativity: 'right'
    }
  }
  public static OPERAND_REGEX = /^[0-9]*\.?[0-9]*$/;
  public static OPERATOR_REGEX = /^(\+|-|\*|\/|\^|\(|\))$/;


  constructor() {
    this.lastToken = '';
    this.iterator = 0;
    this.negativeFlag = false;
    this.outputStack = [];
    this.operatorStack = [];
  }

  reset() {
    this.iterator = 0;
    this.outputStack = [];
    this.operatorStack = [];
    this.negativeFlag = false;
    this.lastToken = '';
  }

  calculate(expression: string) {
    this.parse(expression);
    const result = this.executeOutputStack();
    this.reset();
    return result;
  }


  /**
   * Calculates the outputStack array from Reverse Polish Notation and returns a value 
   */
  executeOutputStack(): number {
    const numberStack: number[] = [];
    while(this.outputStack.length) {
      const token = this.outputStack.shift() as OutputStackToken;

      if(typeof token === 'number') {
        numberStack.push(token)
      }
      else {
        const operand1 = numberStack.pop();
        const operand2 = numberStack.pop();

        if(typeof operand1 === 'undefined' || typeof operand2 === 'undefined') {
          throw this.handleError('Syntax Error')
        }

        switch(token) {
          case '+':
            numberStack.push(operand2 + operand1);
            break;
          case '-':
            numberStack.push(operand2 - operand1);
            break;
          case '*':
            numberStack.push(operand2 * operand1);
            break;
          case '/':
            numberStack.push(operand2 / operand1);
            break;
          case '^':
            numberStack.push(Math.pow(operand2, operand1));
            break;
        }
      }
    }
  
    const result = numberStack.pop();
    if(typeof result === 'undefined') {
      throw this.handleError('Syntax Error')
    }

    return result;
  }

  /**
   * Parses a mathematical expression and saves it in this classes 
   * 'outputStack' property as an array in Reverse Polish Notation 
   * to later be computed through executeOutputStack
   * @param expression a mathematical expression as a string
   */
  parse(expression: string): void {
    while(this.iterator < expression.length) {
      const char = expression.charAt(this.iterator);
      if(char === ' ') {
        this.iterator++;
      }
      else if(this.isOperand(char)) {
        this.processOperand(expression);
        this.negativeFlag = false;
      }
      else if(this.isOperator(char)) {
        this.processOperator(expression);
      }
      else {
        throw this.handleError('Syntax Error')
      }
    }

    while(this.operatorStack.length) {
      const lastOperator = this.operatorStack.pop() as OperatorStackOperator;
      if(lastOperator === '(') {
        throw this.handleError('Mismatched Parentheses')
      }
      this.outputStack.push(lastOperator as OutputStackOperator);
    }
  }

  isOperand(char: string): boolean {
    return Calculator.OPERAND_REGEX.test(char);
  }

  isOperator(char: string): boolean {
    return Calculator.OPERATOR_REGEX.test(char);
  }

  processOperand(expression: string): void {
    let operand = '';
    while(this.isOperand(expression.charAt(this.iterator))) {
      const char = expression.charAt(this.iterator);
      if(char === '') {
        break;
      }
      operand = operand + char;
      this.iterator++;
    }
    this.lastToken = operand;   // set last token before operand is parsed
    const parsedOperand = parseFloat(operand) * (this.negativeFlag ? -1 : 1); // Set to negative if negative flag is set
    this.outputStack.push(parsedOperand);
  }

  processOperator(expression: string): void {
    const operator = expression.charAt(this.iterator) as OperatorStackOperator;
    // If first token is negative or it is a negative after and operator set the negative flag
    if((!this.lastToken || this.isOperator(this.lastToken)) && operator === '-') {
      this.negativeFlag = true;
    }
    else if(operator === '(') {
      this.operatorStack.push(operator);
    }
    else if(operator === ')') {
      while(_.last(this.operatorStack) !== '(') {
        if(this.operatorStack.length < 1) {
          this.handleError('Mismatched Parentheses')
        }
        const lastOperator = this.operatorStack.pop() as OutputStackOperator;
        this.outputStack.push(lastOperator);
      }
      this.operatorStack.pop();
    }
    else {
      while(this.operatorShouldPop(operator)) {
        const lastOperator = this.operatorStack.pop() as OutputStackOperator;
        this.outputStack.push(lastOperator);
      }
      this.operatorStack.push(operator);
    }
    this.lastToken = operator;
    this.iterator++;
  }

  /**
   * Checks two operands for returns true if operand1 has higher or equal precendence than operand2
   * @param operand1 first operand to compare
   * @param operand2 second operand to compare
   * @returns positive if higher, 0 if same, negative if lower
   */
  comparePrecendence(operand1: OutputStackOperator, operand2: OutputStackOperator): number {
    const precedence1 = Calculator.ORDER_OF_OPERATIONS[operand1].precedence;
    const precedence2 = Calculator.ORDER_OF_OPERATIONS[operand2].precedence;
    return precedence1 - precedence2;
  }


  /**
   * returns true if top element of operator stack is not a left parenthesis and 
   * has higher precedence of operator or same precedence but is left-associative of operator
   * @param operator operator to compare to current operator stack
   * @returns 
   */
  operatorShouldPop(operator: OutputStackOperator) {
    if(!this.operatorStack.length) return false;
    if(_.last(this.operatorStack) === '(') return false;
    // Compare precendence of operator on top of stack with current operation
    const hasPrecedence = this.comparePrecendence(_.last(this.operatorStack) as OutputStackOperator, operator);

    if(hasPrecedence > 0) { // Higher Precedence 
      return true;
    }
    else if(hasPrecedence < 0) { // Same Precedence
      return false;
    }
    else { // Same Precedence
      return Calculator.ORDER_OF_OPERATIONS[operator].associativity === 'left';
    }
  }

  handleError(error: string): string {
    this.reset();
    return error;
  }

  validate(expression: string): boolean {

    return Boolean(expression);
  }
}


export default new Calculator();