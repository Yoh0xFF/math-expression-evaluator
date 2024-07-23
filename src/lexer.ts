export const tokens: Array<string> = ['+', '-', '*', '/'] as const;
export type TokenType = (typeof tokens)[number];

export class Lexer {
  private expression: string;
  private index: number;
  private eof: number;

  constructor(expression: string) {
    this.expression = expression;
    this.index = 0;
    this.eof = expression.length;
  }

  tokenize() {
    while (!this.isEof()) {
      while (this.skipWhitespace()) {
        this.getChar();
      }

      const c = this.getChar();
      if (this.isToken(c)) {
        // TODO
      } else if (this.isDigit(c)) {
        // TODO
      }
    }
  }

  private getChar(): string {
    if (this.isEof()) {
      throw new Error('End of expression');
    }
    return this.expression.at(this.index++)!;
  }

  private pickChar(): string {
    if (this.isEof()) {
      throw new Error('End of expression');
    }
    return this.expression.at(this.index)!;
  }

  private isToken(c: string): boolean {
    return tokens.includes(c);
  }

  private isDigit(c: string): boolean {
    return c >= '0' && c <= '9';
  }

  private isWhitespace(c: string): boolean {
    return c === ' ' || c === '\n' || c == '\t';
  }

  private skipWhitespace(): boolean {
    if (this.isEof()) {
      return false;
    }

    const c = this.pickChar();
    if (this.isWhitespace(c)) {
      this.index++;
      return true;
    }

    return false;
  }

  private isEof(): boolean {
    return this.index === this.eof;
  }
}
