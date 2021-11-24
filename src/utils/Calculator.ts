import _ from "lodash";

export type CalculatorFunction = "log" | "ln" | "sin" | "cos" | "tan" | "sqrt";
export type OutputStackOperator = "+" | "-" | "*" | "/" | "^" | CalculatorFunction;
export type OrderedOperator = Exclude<OutputStackOperator, CalculatorFunction>;
export type OperatorStackOperator = OutputStackOperator | "(" | ")";

export type OrderOfOperations = {
  [key in OrderedOperator]: {
    precedence: number;
    associativity: "left" | "right";
  };
};

export type OutputStackToken = OutputStackOperator | number;

export type CalculatorError = "Syntax Error" | "Mismatched Parentheses" 
  | "Negative Logarithm Error";

class Calculator {
  private negativeFlag: boolean;
  private lastToken: string;
  private iterator: number;
  public outputStack: OutputStackToken[];
  private operatorStack: OperatorStackOperator[];

  public static ORDER_OF_OPERATIONS: OrderOfOperations = {
    "+": {
      precedence: 2,
      associativity: "left",
    },
    "-": {
      precedence: 2,
      associativity: "left",
    },
    "*": {
      precedence: 3,
      associativity: "left",
    },
    "/": {
      precedence: 3,
      associativity: "left",
    },
    "^": {
      precedence: 4,
      associativity: "right",
    },
  };
  public static FUNCTIONS = ['']
  public static OPERAND_REGEX = /^[0-9]*\.?[0-9]*$/;
  public static OPERATOR_REGEX = /^(\+|-|\*|\/|\^|\(|\))$/;
  public static LETTER_REGEX = /^[a-zA-Z]+$/;
  public static FUNCTION_REGEX = /^(log|ln|sin|cos|tan|sqrt)$/


  // Error Constants
  public static SYNTAX_ERROR: CalculatorError = "Syntax Error";
  public static PARENTHESES_ERROR: CalculatorError = "Mismatched Parentheses";
  public static LOG_ERROR: CalculatorError = "Negative Logarithm Error";

  constructor() {
    this.lastToken = "";
    this.iterator = 0;
    this.negativeFlag = false;
    this.outputStack = [];
    this.operatorStack = [];
  }

  // Resets calculator to constructor values
  reset() {
    this.iterator = 0;
    this.outputStack = [];
    this.operatorStack = [];
    this.negativeFlag = false;
    this.lastToken = "";
  }

  /**
   * Calculates an infix expression string and returns a number or an error if 
   * it cannot be calculated
   * @param {string} expression mathematical expression to be calculated
   * @returns {number | CalculatorError} 
   */
  calculate(expression: string): number | CalculatorError {
    let result;
    try {
      this.parse(expression);
      result = this.evaluate();
    } catch (err) {
      result = err as CalculatorError;
    }
    this.reset();
    return result;
  }

  /**
   * Performs a reverse polish notation evaluation on the outputStack, it is 
   * meant to be called after the Calculator.parse method
   * @returns numb
   * @throws {CalculatorError}
   */
  evaluate(): number {
    const numberStack: number[] = [];
    while (this.outputStack.length) {
      const token = this.outputStack.shift() as OutputStackToken;

      if (typeof token === "number") {
        numberStack.push(token);
      } 
      else if(this.isFunction(token)) {
        const operand = numberStack.pop();

        if(typeof operand === "undefined") {
          throw Calculator.SYNTAX_ERROR;
        }

        let result;
        switch(token) {
          case 'log':
            result = Math.log10(operand);
            if(_.isNaN(result)) {
              throw Calculator.LOG_ERROR;
            }
            numberStack.push(result);
            break;
          case 'ln':
            result = Math.log(operand);
            if(_.isNaN(result)) {
              throw Calculator.LOG_ERROR;
            }
            numberStack.push(result);
            break;
          case 'sin':
            result = Math.sin(operand);
            if(_.isNaN(result)) {
              throw Calculator.LOG_ERROR;
            }
            numberStack.push(result);
            break;
          case 'cos':
            result = Math.cos(operand);
            if(_.isNaN(result)) {
              throw Calculator.LOG_ERROR;
            }
            numberStack.push(result);
            break;
          case 'tan':
            result = Math.tan(operand);
            if(_.isNaN(result)) {
              throw Calculator.LOG_ERROR;
            }
            numberStack.push(result);
            break;
          case 'sqrt':
            result = Math.sqrt(operand);
            if(_.isNaN(result)) {
              throw Calculator.LOG_ERROR;
            }
            numberStack.push(result);
            break;
        }
      } 
      else {
        const operand1 = numberStack.pop();
        const operand2 = numberStack.pop();

        if (typeof operand1 === "undefined" || typeof operand2 === 'undefined') {
          throw Calculator.SYNTAX_ERROR;
        }

        switch (token) {
          case "+":
            numberStack.push(operand2 + operand1);
            break;
          case "-":
            numberStack.push(operand2 - operand1);
            break;
          case "*":
            numberStack.push(operand2 * operand1);
            break;
          case "/":
            numberStack.push(operand2 / operand1);
            break;
          case "^":
            numberStack.push(Math.pow(operand2, operand1));
            break;
        }
      }
    }

    const result = numberStack.pop();
    if (typeof result === "undefined") {
      throw Calculator.SYNTAX_ERROR;
    }

    return result;
  }

  /**
   * Parses a mathematical expression using the shunting yard algorithm and 
   * populates the output stack with the result
   * @param expression a mathematical expression as a string
   */
  parse(expression: string): void {
    while (this.iterator < expression.length) {
      const char = expression.charAt(this.iterator);
      if (char === " ") {
        this.iterator++;
      } 
      else if (this.isOperand(char)) {
        expression = this.processOperand(expression);
        this.negativeFlag = false;
      } 
      else if (this.isOperator(char)) {
        expression = this.processOperator(expression);
      } 
      else if (this.isLetter(char)) {
        expression = this.processFunction(expression);
      }
      else {
        throw Calculator.SYNTAX_ERROR;
      }
    }

    while (this.operatorStack.length) {
      const lastOperator = this.operatorStack.pop() as OperatorStackOperator;
      if (lastOperator === "(") {
        throw Calculator.PARENTHESES_ERROR;
      }
      this.outputStack.push(lastOperator as OutputStackOperator);
    }
  }

  /**
   * Parses a number from the expression string, adds parsed number to output 
   * stack and increases the iterator according to the length of the number
   * @param expression 
   * @returns {string} expression with modifications if necessary
   */
  processOperand(expression: string): string {
    // insert a "*" in a case such as (4-1)3 to be (4-1)*3
    if(this.lastToken === ')') {
      return this.processOperator(
        this.insertOperand(expression, '*')
      )
    }
    let operand = "";
    while (this.isOperand(expression.charAt(this.iterator))) {
      const char = expression.charAt(this.iterator);
      if (char === "") {
        break;
      }
      operand = operand + char;
      this.iterator++;
    }
    this.lastToken = operand; 

    // Parse number and set to negative if negative flag is set
    const parsedOperand = parseFloat(operand) * (this.negativeFlag ? -1 : 1); 
    this.outputStack.push(parsedOperand);
    return expression
  }

  /**
   * Processes an operator in the expression at the current iterator index and 
   * modifies the output stack and operator stack according to the shunting yard
   * algorithm
   * @param expression 
   * @returns {string} expression with modifications if necessary
   */
  processOperator(expression: string): string {
    const operator = expression.charAt(this.iterator) as OperatorStackOperator;

    // Set negative flag if operater is - and is first token or last token was 
    // an operator
    if (this.shouldSetNegativeFlag(operator)) {
      if(this.negativeFlag) {
        throw Calculator.SYNTAX_ERROR;
      }
      this.negativeFlag = true;
    } 
    else if (operator === "(") {
      // insert "*" into the expression in a case such as 3(4) or (3)(4)
      // and recursively call this process with modified expression
      if(this.isOperand(this.lastToken) || this.lastToken == ')') {
        return this.processOperator(
          this.insertOperand(expression, '*')
        );
      }
      this.operatorStack.push(operator);
    } 
    else if (operator === ")") {
      // insert "*" into the expression in a case such as 4(3)
      // and recursively call this process with modified expression
      while (_.last(this.operatorStack) !== "(") {
        if (this.operatorStack.length < 1) {
          throw Calculator.PARENTHESES_ERROR;
        }
        const lastOperator = this.operatorStack.pop() as OutputStackOperator;
        this.outputStack.push(lastOperator);
      }
      this.operatorStack.pop();
      if(this.isFunction(_.last(this.operatorStack) as string)) {
        const lastOperator = this.operatorStack.pop() as OutputStackOperator;
        this.outputStack.push(lastOperator);
      }
    } 
    else {
      while (this.operatorShouldPop(operator as OrderedOperator)) {
        const lastOperator = this.operatorStack.pop() as OutputStackOperator;
        this.outputStack.push(lastOperator);
      }
      this.operatorStack.push(operator);
    }
    this.lastToken = operator;
    this.iterator++;

    return expression;
  }

  /**
   * Checks to see if letter is the start of a function and adds it to the 
   * operator stack
   * @param expression 
   * @returns {string} expression with modifications if necessary
   */
  processFunction(expression: string): string {    
    if(this.lastToken === ')' || this.isOperand(this.lastToken)) {
      return this.processOperator(
        this.insertOperand(expression, '*')
      )
    }
    let func = '';
    while(this.isLetter(expression.charAt(this.iterator))) {
      const char = expression.charAt(this.iterator);
      if(char === '') {
        break;
      }
      func = func + char;
      this.iterator++;
    }
    if(!this.isFunction(func)) {
      throw Calculator.SYNTAX_ERROR;
    }
    this.lastToken = func;
    this.operatorStack.push(func as CalculatorFunction);
    return expression;
  }

  /**
   * Checks two operands for returns true if operand1 has higher or equal 
   * precendence than operand2
   * @param operand1 first operand to compare
   * @param operand2 second operand to compare
   * @returns positive if higher, 0 if same, negative if lower
   */
  comparePrecendence(
    operand1: OrderedOperator,
    operand2: OrderedOperator
  ): number {
    const precedence1 = Calculator.ORDER_OF_OPERATIONS[operand1].precedence;
    const precedence2 = Calculator.ORDER_OF_OPERATIONS[operand2].precedence;
    return precedence1 - precedence2;
  }

  /**
   * returns true if top element of operator stack is not a left parenthesis and
   * has higher precedence of operator or same precedence but is 
   * left-associative of operator
   * @param operator operator to compare to current operator stack
   * @returns
   */
  operatorShouldPop(operator: OrderedOperator): boolean {
    if (!this.operatorStack.length) return false;
    if (_.last(this.operatorStack) === "(") return false;
    if (this.isFunction(_.last(this.operatorStack) as string)) {
      throw Calculator.SYNTAX_ERROR
    }

    // Compare precendence of operator on top of stack with current operation
    const hasPrecedence = this.comparePrecendence(
      _.last(this.operatorStack) as OrderedOperator,
      operator
    );

    if (hasPrecedence > 0) {
      // Higher Precedence
      return true;
    } else if (hasPrecedence < 0) {
      // Same Precedence
      return false;
    } else {
      // Same Precedence
      return Calculator.ORDER_OF_OPERATIONS[operator].associativity === "left";
    }
  }

  /**
   * Checks if current operator is '-' and determines whether it should treated
   * as an operator or to negate the next read number
   * @param operator 
   */
  shouldSetNegativeFlag(operator: OperatorStackOperator): boolean {
    if(operator !== '-') return false;
    if(!this.lastToken) return true;
    if(this.isOperator(this.lastToken) && this.lastToken !== ')') {
      return true;
    }
    return false;
  }

  /**
   * inserts an operand into the string at the current iterator index and 
   * returns new expression
   * @param expression 
   * @param operator operator to insert into expression
   */
  insertOperand(expression: string, operator: OutputStackOperator): string {
    return expression.substr(0, this.iterator) + operator 
      + expression.substr(this.iterator, expression.length)
  }

  isLetter(char: string): boolean {
    return Boolean(char) && Calculator.LETTER_REGEX.test(char);
  }

  isFunction(func: string): boolean {
    return Boolean(func) && Calculator.FUNCTION_REGEX.test(func);
  }

  isOperand(char: string): boolean {
    return Boolean(char) && Calculator.OPERAND_REGEX.test(char);
  }

  isOperator(char: string): boolean {
    return Boolean(char) && Calculator.OPERATOR_REGEX.test(char);
  }
}

export default new Calculator();
