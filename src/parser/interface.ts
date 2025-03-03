import { Lexer } from '@root/lexer/index.ts';
import { Expression } from '@root/model/index.ts';

export interface ParserInterface {
  lexer: Lexer;

  parseExpression(): Expression;
}
