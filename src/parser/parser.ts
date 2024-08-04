import { LexerType } from '../lexer';
import { Expression } from '../model';

export interface ParserType {
  lexer: LexerType;

  parseExpression(): Expression;
}
