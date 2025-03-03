import { Token } from '@root/model/index.ts';

export interface Lexer {
  expression: string;

  nextToken(): Token;
}

export type LexerClassType = new (expression: string) => Lexer;
