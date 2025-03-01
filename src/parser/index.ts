import { Parser, ParserClassType } from 'parser/parser';
import { PrattParser } from 'parser/pratt-parser';
import { RecursiveDescentParser } from 'parser/recursive-descent-parser';

export function getParserClass(type: 'Recursive' | 'Pratt'): ParserClassType {
  switch (type) {
    case 'Recursive':
      return RecursiveDescentParser;
    case 'Pratt':
      return PrattParser;
  }
}

export type { Parser, ParserClassType };
