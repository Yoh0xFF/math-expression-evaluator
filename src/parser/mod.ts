import { Parser, ParserClassType } from '@root/parser/parser';
import { PrattParser } from '@root/parser/pratt-parser';
import { RecursiveDescentParser } from '@root/parser/recursive-descent-parser';

export function getParserClass(type: 'Recursive' | 'Pratt'): ParserClassType {
  switch (type) {
    case 'Recursive':
      return RecursiveDescentParser;
    case 'Pratt':
      return PrattParser;
  }
}

export type { Parser, ParserClassType };
