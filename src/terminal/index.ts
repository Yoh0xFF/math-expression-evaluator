import { ReaderInput } from '@root/terminal/reader-input.ts';
import { TtyInput } from '@root/terminal/tty-input.ts';

export class TerminalInput {
  private ttyInput: TtyInput | null = null;
  private readerInput: ReaderInput | null = null;

  constructor() {
    // Check if we're in a TTY environment
    if (process.stdin.isTTY) {
      // TTY (interactive terminal) mode
      this.ttyInput = new TtyInput();
    } else {
      // Non-TTY mode (e.g., piped input or non-interactive environment)
      this.readerInput = new ReaderInput();
    }
  }

  cleanup() {
    if (this.ttyInput) {
      this.ttyInput.cleanup();
    }
    if (this.readerInput) {
      this.readerInput.cleanup();
    }
  }
}
