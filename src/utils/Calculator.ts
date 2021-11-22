

export type Operator = '+' | '-' | '/' | '*' | '(' | ')';

export type Token = {
  value: number | Operator;
  type: 'operator' | 'operand'
}

class Calculator {
  outputQueue: Array<number>;
  inputStack: Array<Operator>;

  constructor() {
    this.outputQueue = [];
    this.inputStack = [];
  }

  parse(expression: string): number {
    if(!this.validate(expression)) {
      throw 'Invalid Expression'
    }


    for(let i = 0; i < expression.length; i++) {
      let char = expression.charAt(i);

    }

    return 0;
  }

  validate(expression: string): boolean {

    return Boolean(expression);
  }

  readToken(token: string): Token {

  }
}


export default new Calculator();