import { Lexer } from '@root/lexer/mod';
import { Expression } from '@root/model/mod';

export interface Parser {
  lexer: Lexer;

  parseExpression(): Expression;
}

export type ParserClassType = new (lexer: Lexer) => Parser;
