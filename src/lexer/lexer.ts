import { Token } from '../model/mod';

export interface Lexer {
  expression: string;

  nextToken(): Token;
}

export type LexerClassType = new (expression: string) => Lexer;
