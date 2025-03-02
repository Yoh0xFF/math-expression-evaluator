import { Lexer, LexerClassType } from '@root/lexer/lexer';
import { RegexLexer } from '@root/lexer/regex-lexer';
import { ScannerLexer } from '@root/lexer/scanner-lexer';

export type { Lexer, LexerClassType };

export function getLexerClass(type: 'Regex' | 'Scanner'): LexerClassType {
  switch (type) {
    case 'Regex':
      return RegexLexer;
    case 'Scanner':
      return ScannerLexer;
  }
}
