import { TerminalInput } from '@root/terminal/index.ts';
import { config } from 'dotenv';

config();
console.log('=====> Lexer config: ', process.env['LEXER']);
console.log('=====> Parser config: ', process.env['PARSER']);

// Prompt
const terminalInput = new TerminalInput();

// Cleanup on exit
process.on('exit', () => {
  terminalInput.cleanup();
});
