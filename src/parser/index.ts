import { LexerType } from '../lexer';
import { ParserType } from './parser';
import { PrattParser } from './pratt-parser';
import { RecursiveDescentParser } from './recursive-descent-parser';

export function getParserClass(
  type: 'Recursive' | 'Pratt',
): new (lexer: LexerType) => ParserType {
  switch (type) {
    case 'Recursive':
      return RecursiveDescentParser;
    case 'Pratt':
      return PrattParser;
  }
}

export type { ParserType };
