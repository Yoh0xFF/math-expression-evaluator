export interface Token {
  type: 'Operand' | 'Operator' | 'Parenthesis';
  value: string;
}

export class Lexer {
  private operators: Array<string> = ['+', '-', '*', '/'];
  private parentheses: Array<string> = ['(', ')'];
  private expression: string;
  private index: number;
  private eof: number;

  constructor(expression: string) {
    this.expression = expression;
    this.index = 0;
    this.eof = expression.length;
  }

  tokenize(): Array<Token> {
    const tokens: Array<Token> = [];

    while (true) {
      this.skipWhitespace();
      if (this.isEof()) {
        break;
      }

      const nextChar = this.pickChar();
      if (this.operators.includes(nextChar)) {
        tokens.push({ type: 'Operator', value: this.getChar() });
      } else if (this.parentheses.includes(nextChar)) {
        tokens.push({ type: 'Parenthesis', value: this.getChar() });
      } else if (this.isDigit(nextChar)) {
        tokens.push({ type: 'Operand', value: this.readInteger() });
      } else {
        throw new Error(
          `Invalid expression, unknow character '${nextChar}' at index ${this.index}`,
        );
      }
    }

    return tokens;
  }

  private isWhitespace(c: string): boolean {
    return c === ' ' || c === '\n' || c == '\t';
  }

  private skipWhitespace() {
    if (!this.isEof() && this.isWhitespace(this.pickChar())) {
      this.getChar();
    }
  }

  private isDigit(c: string): boolean {
    return c >= '0' && c <= '9';
  }

  private readInteger(): string {
    const startIndex = this.index;
    while (!this.isEof() && this.isDigit(this.pickChar())) {
      this.getChar();
    }
    return this.expression.substring(startIndex, this.index);
  }

  private getChar(): string {
    if (this.isEof()) {
      throw new Error('Cannot get a char end of expression');
    }
    return this.expression.at(this.index++)!;
  }

  private pickChar(): string {
    if (this.isEof()) {
      throw new Error('Cannot pick a char end of expression');
    }
    return this.expression.at(this.index)!;
  }

  private isEof(): boolean {
    return this.index === this.eof;
  }
}
