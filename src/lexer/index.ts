import { Lexer, LexerClassType } from 'lexer/lexer';
import { RegexLexer } from 'lexer/regex-lexer';
import { ScannerLexer } from 'lexer/scanner-lexer';

export type { Lexer, LexerClassType };

export function getLexerClass(type: 'Regex' | 'Scanner'): LexerClassType {
  switch (type) {
    case 'Regex':
      return RegexLexer;
    case 'Scanner':
      return ScannerLexer;
  }
}
