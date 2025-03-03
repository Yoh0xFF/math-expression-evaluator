import { Lexer } from '@root/lexer/index.ts';
import { Expression } from '@root/model/index.ts';

export interface Parser {
  lexer: Lexer;

  parseExpression(): Expression;
}

export type ParserClassType = new (lexer: Lexer) => Parser;
