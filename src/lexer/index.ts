import { LexerInterface } from '@root/lexer/interface.ts';
import { RegexLexer } from '@root/lexer/regex-lexer.ts';
import { ScannerLexer } from '@root/lexer/scanner-lexer.ts';
import { Token } from '@root/model/index.ts';

export class Lexer implements LexerInterface {
  private lexer: LexerInterface;

  constructor(public expression: string) {
    const lexerConfig = (process.env['LEXER'] ?? 'Regex') as
      | 'Regex'
      | 'Scanner';

    switch (lexerConfig) {
      case 'Regex':
        this.lexer = new RegexLexer(this.expression);
        break;
      case 'Scanner':
        this.lexer = new ScannerLexer(this.expression);
        break;
      default:
        this.lexer = new RegexLexer(this.expression);
    }
  }

  nextToken(): Token {
    return this.lexer.nextToken();
  }
}
