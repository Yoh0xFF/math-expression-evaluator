import { Token } from '@root/model/index.ts';

export interface LexerInterface {
  expression: string;

  nextToken(): Token;
}
