import { config } from 'dotenv';
import { getLexerClass } from 'lexer';
import { getParserClass } from 'parser';
import { TerminalInput } from 'terminal';

config();

// Select which lexer to use
const lexerConfig = (process.env['LEXER'] ?? 'Regex') as 'Regex' | 'Scanner';
console.log(`Using the ${lexerConfig} lexer.`);
const LexerClass = getLexerClass(lexerConfig);

// Select which parser to use
const parserConfig = (process.env['PARSER'] ?? 'Recursive') as
  | 'Recursive'
  | 'Pratt';
console.log(`Using the ${parserConfig} parser.`);
export const ParserClass = getParserClass(parserConfig);

// Prompt
const terminalInput = new TerminalInput(LexerClass, ParserClass);

// Cleanup on exit
process.on('exit', () => {
  terminalInput.cleanup();
});
