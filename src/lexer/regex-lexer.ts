import { Token, TokenType } from '../model';
import { LexerType } from './lexer';

export class RegexLexer implements LexerType {
  private index: number;
  private tokenTypeMatchers: Array<[RegExp, TokenType | null]> = [
    [/^\s+/, null],
    [/^\d+(\.\d+)?/, 'Operand'],
    [/^[+\-*\/]/, 'Operator'],
    [/^[()]/, 'Parenthesis'],
  ];

  constructor(public expression: string) {
    this.index = 0;
  }

  nextToken(): Token {
    const subExpression = this.expression.slice(this.index);

    for (const [matcher, tokeType] of this.tokenTypeMatchers) {
      const matched = matcher.exec(subExpression);

      // Try to match other token
      if (matched == null) {
        continue;
      }
      // Skip whitespace
      if (tokeType == null) {
        this.index += matched[0].length;
        return this.nextToken();
      }

      this.index += matched[0].length;
      return {
        type: tokeType,
        value: matched[0],
      };
    }

    throw new Error(
      `Invalid expression, unknow character '${subExpression[0]}' at index ${this.index}`,
    );
  }
}
