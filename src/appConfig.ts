import { config } from 'dotenv';

config();

export type LexerType = 'Regex' | 'Scanner';
export type ParserType = 'Recursive' | 'Pratt';

export interface AppConfig {
  lexerType: LexerType;
  parserType: ParserType;
}

function initAppConfig(): AppConfig {
  console.log('=====> Lexer config: ', process.env['LEXER']);
  console.log('=====> Parser config: ', process.env['PARSER']);

  // Select which lexer to use
  const lexerType = (process.env['LEXER'] ?? 'Regex') as LexerType;

  // Select which parser to use
  const parserType = (process.env['PARSER'] ?? 'Recursive') as ParserType;

  return {
    lexerType,
    parserType,
  };
}

export const appConfig = initAppConfig();
