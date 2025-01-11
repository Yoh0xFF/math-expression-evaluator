import chalk from 'chalk';
import { config } from 'dotenv';
import { getLexerClass } from './lexer';
import { getParserClass } from './parser';
import { TerminalInput } from './terminal-input';

config();

// Select which lexer to use
const lexerConfig = (process.env['LEXER'] ?? 'Regex') as 'Regex' | 'Scanner';
console.log(chalk.red(`Using the ${lexerConfig} lexer.`));
const LexerClass = getLexerClass(lexerConfig);

// Select which parser to use
const parserConfig = (process.env['PARSER'] ?? 'Recursive') as
  | 'Recursive'
  | 'Pratt';
console.log(chalk.red(`Using the ${parserConfig} parser.`));
export const ParserClass = getParserClass(parserConfig);

// prompt();
const terminalInput = new TerminalInput(LexerClass, ParserClass);

// Cleanup on exit
process.on('exit', () => {
  terminalInput.cleanup();
});
