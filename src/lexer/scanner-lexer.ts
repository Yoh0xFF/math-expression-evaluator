import { InvalidExpression, Token, TokenType } from '../model';
import { Lexer } from './lexer';

export class ScannerLexer implements Lexer {
  private operators: Array<string> = ['+', '-', '*', '/'] as const;
  private parentheses: Array<string> = ['(', ')'] as const;
  private index: number;
  private end: number;

  constructor(public expression: string) {
    this.index = 0;
    this.end = expression.length;
  }

  nextToken(): Token {
    this.skipWhitespace();
    if (this.isEnd()) {
      return { index: this.expression.length, type: 'EoE', value: ';' };
    }

    const currentChar = this.currentChar();
    if (this.operators.includes(currentChar)) {
      const index = this.index;
      const value = this.currentChar();
      this.advance();
      return {
        index,
        type: `Operator${currentChar}` as TokenType,
        value,
      };
    } else if (this.parentheses.includes(currentChar)) {
      const index = this.index;
      const value = this.currentChar();
      this.advance();
      return {
        index,
        type: `Parenthesis${currentChar}` as TokenType,
        value,
      };
    } else if (this.isDigit(currentChar)) {
      return { index: this.index, type: 'Operand', value: this.readNumber() };
    } else {
      throw new InvalidExpression(currentChar, this.index);
    }
  }

  private isWhitespace(c: string): boolean {
    return c === ' ' || c === '\n' || c == '\t';
  }

  private skipWhitespace() {
    while (this.isWhitespace(this.currentChar())) {
      this.advance();
    }
  }

  private isDigit(c: string): boolean {
    return c >= '0' && c <= '9';
  }

  private readNumber(): string {
    const startIndex = this.index;

    while (this.isDigit(this.currentChar())) {
      this.advance();
    }

    if (this.currentChar() === '.' && this.isDigit(this.nextChar())) {
      this.advance();
    }

    while (this.isDigit(this.currentChar())) {
      this.advance();
    }

    return this.expression.substring(startIndex, this.index);
  }

  private advance() {
    this.index++;
  }

  private currentChar(): string {
    if (this.isEnd()) {
      return '\0';
    }
    return this.expression.at(this.index)!;
  }

  private nextChar(): string {
    if (this.index + 1 >= this.end) {
      return '\0';
    }
    return this.expression.at(this.index + 1)!;
  }

  private isEnd(): boolean {
    return this.index === this.end;
  }
}
