import { Parser, ParserClassType } from './parser';
import { PrattParser } from './pratt-parser';
import { RecursiveDescentParser } from './recursive-descent-parser';

export function getParserClass(type: 'Recursive' | 'Pratt'): ParserClassType {
  switch (type) {
    case 'Recursive':
      return RecursiveDescentParser;
    case 'Pratt':
      return PrattParser;
  }
}

export type { Parser, ParserClassType };
