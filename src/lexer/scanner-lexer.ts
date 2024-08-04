import { Token } from '../model';
import { LexerType } from './lexer';

export class ScannerLexer implements LexerType {
  private operators: Array<string> = ['+', '-', '*', '/'];
  private parentheses: Array<string> = ['(', ')'];
  private index: number;
  private end: number;

  constructor(public expression: string) {
    this.index = 0;
    this.end = expression.length;
  }

  nextToken(): Token {
    this.skipWhitespace();
    if (this.isEnd()) {
      return { type: 'EoE', value: '' };
    }

    const nextChar = this.pickChar();
    if (this.operators.includes(nextChar)) {
      return { type: 'Operator', value: this.getChar() };
    } else if (this.parentheses.includes(nextChar)) {
      return { type: 'Parenthesis', value: this.getChar() };
    } else if (this.isDigit(nextChar)) {
      return { type: 'Operand', value: this.readNumber() };
    } else {
      throw new Error(
        `Invalid expression, unknow character '${nextChar}' at index ${this.index}`,
      );
    }
  }

  private isWhitespace(c: string): boolean {
    return c === ' ' || c === '\n' || c == '\t';
  }

  private skipWhitespace() {
    while (this.isWhitespace(this.pickChar())) {
      this.getChar();
    }
  }

  private isDigit(c: string): boolean {
    return c >= '0' && c <= '9';
  }

  private readNumber(): string {
    const startIndex = this.index;

    while (this.isDigit(this.pickChar())) {
      this.getChar();
    }

    if (this.pickChar() === '.' && this.isDigit(this.pickNextChar())) {
      this.getChar();
    }

    while (this.isDigit(this.pickChar())) {
      this.getChar();
    }

    return this.expression.substring(startIndex, this.index);
  }

  private getChar(): string {
    if (this.isEnd()) {
      return '\0';
    }
    return this.expression.at(this.index++)!;
  }

  private pickChar(): string {
    if (this.isEnd()) {
      return '\0';
    }
    return this.expression.at(this.index)!;
  }

  private pickNextChar(): string {
    if (this.index + 1 >= this.end) {
      return '\0';
    }
    return this.expression.at(this.index + 1)!;
  }

  private isEnd(): boolean {
    return this.index === this.end;
  }
}
