import { Parser, ParserClassType } from '@root/parser/parser.ts';
import { PrattParser } from '@root/parser/pratt-parser.ts';
import { RecursiveDescentParser } from '@root/parser/recursive-descent-parser.ts';

export function getParserClass(type: 'Recursive' | 'Pratt'): ParserClassType {
  switch (type) {
    case 'Recursive':
      return RecursiveDescentParser;
    case 'Pratt':
      return PrattParser;
  }
}

export type { Parser, ParserClassType };
