import { LexerType } from './lexer';
import { ScannerLexer } from './scanner-lexer';

export const Lexer: new (expression: string) => LexerType = ScannerLexer;
export type { LexerType };
