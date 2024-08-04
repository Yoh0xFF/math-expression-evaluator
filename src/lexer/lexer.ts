import { Token } from '../model';

export interface LexerType {
  expression: string;

  nextToken(): Token;
}
