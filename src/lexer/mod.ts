import { Lexer, LexerClassType } from './lexer';
import { RegexLexer } from './regex-lexer';
import { ScannerLexer } from './scanner-lexer';

export type { Lexer, LexerClassType };

export function getLexerClass(type: 'Regex' | 'Scanner'): LexerClassType {
  switch (type) {
    case 'Regex':
      return RegexLexer;
    case 'Scanner':
      return ScannerLexer;
  }
}
