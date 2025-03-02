import { Lexer } from '../lexer/mod';
import { Expression } from '../model/mod';

export interface Parser {
  lexer: Lexer;

  parseExpression(): Expression;
}

export type ParserClassType = new (lexer: Lexer) => Parser;
