import { Lexer } from '@root/lexer';
import { Expression } from '@root/model';

export interface Parser {
  lexer: Lexer;

  parseExpression(): Expression;
}

export type ParserClassType = new (lexer: Lexer) => Parser;
