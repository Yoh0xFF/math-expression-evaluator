import { Lexer } from '../lexer/lexer';
import { Expression } from '../model';

export interface Parser {
  lexer: Lexer;

  parseExpression(): Expression;
}

export type ParserClassType = new (lexer: Lexer) => Parser;
