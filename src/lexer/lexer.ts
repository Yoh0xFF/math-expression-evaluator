import { Token } from '@root/model/mod';

export interface Lexer {
  expression: string;

  nextToken(): Token;
}

export type LexerClassType = new (expression: string) => Lexer;
