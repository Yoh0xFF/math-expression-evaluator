import { Token } from '@root/model';

export interface Lexer {
  expression: string;

  nextToken(): Token;
}

export type LexerClassType = new (expression: string) => Lexer;
