import { TerminalInput } from '@root/terminal/index.ts';

// Prompt
const terminalInput = new TerminalInput();

// Cleanup on exit
process.on('exit', () => {
  terminalInput.cleanup();
});
