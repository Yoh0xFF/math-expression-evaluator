import { LexerType } from '../lexer';
import { Expression } from '../model';
import { ParserType } from './parser';

export class PrattParser implements ParserType {
  constructor(public lexer: LexerType) {}

  parseExpression(): Expression {
    // TODO
    return null!;
  }
}
