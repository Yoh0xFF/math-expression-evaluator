import { LexerType } from '../lexer';
import { ParserType } from './parser';
import { RecursiveDescentParser } from './recursive-descent-parser';

export const Parser: new (lexer: LexerType) => ParserType =
  RecursiveDescentParser;
export type { ParserType };
