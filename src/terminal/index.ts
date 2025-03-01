import { LexerClassType } from 'lexer';
import { ParserClassType } from 'parser';
import { ReaderInput } from 'terminal/reader-input';
import { TtyInput } from 'terminal/tty-input';

export class TerminalInput {
  private ttyInput: TtyInput | null = null;
  private readerInput: ReaderInput | null = null;

  constructor(
    private LexerClass: LexerClassType,
    private ParserClass: ParserClassType,
  ) {
    // Check if we're in a TTY environment
    if (process.stdin.isTTY) {
      // TTY (interactive terminal) mode
      this.ttyInput = new TtyInput(this.LexerClass, this.ParserClass);
    } else {
      // Non-TTY mode (e.g., piped input or non-interactive environment)
      this.readerInput = new ReaderInput(this.LexerClass, this.ParserClass);
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
