import { Lexer, LexerClassType } from '@root/lexer/lexer.ts';
import { RegexLexer } from '@root/lexer/regex-lexer.ts';
import { ScannerLexer } from '@root/lexer/scanner-lexer.ts';

export type { Lexer, LexerClassType };

export function getLexerClass(type: 'Regex' | 'Scanner'): LexerClassType {
  switch (type) {
    case 'Regex':
      return RegexLexer;
    case 'Scanner':
      return ScannerLexer;
  }
}
