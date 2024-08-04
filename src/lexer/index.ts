import { LexerType } from './lexer';
import { RegexLexer } from './regex-lexer';
import { ScannerLexer } from './scanner-lexer';

export type { LexerType };

export function getLexerClass(
  type: 'Regex' | 'Scanner',
): new (expression: string) => LexerType {
  switch (type) {
    case 'Regex':
      return RegexLexer;
    case 'Scanner':
      return ScannerLexer;
  }
}
