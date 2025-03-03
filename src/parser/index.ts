import { Lexer } from '@root/lexer/index.ts';
import { Expression } from '@root/model/index.ts';
import { ParserInterface } from '@root/parser/interface.ts';
import { PrattParser } from '@root/parser/pratt-parser.ts';
import { RecursiveDescentParser } from '@root/parser/recursive-descent-parser.ts';

export class Parser implements ParserInterface {
  private parser: ParserInterface;

  constructor(public lexer: Lexer) {
    // Select which parser to use
    const parserConfig = (process.env['PARSER'] ?? 'Recursive') as
      | 'Recursive'
      | 'Pratt';

    switch (parserConfig) {
      case 'Recursive':
        this.parser = new RecursiveDescentParser(lexer);
        break;
      case 'Pratt':
        this.parser = new PrattParser(lexer);
        break;
      default:
        this.parser = new RecursiveDescentParser(lexer);
    }
  }

  parseExpression(): Expression {
    return this.parser.parseExpression();
  }
}
