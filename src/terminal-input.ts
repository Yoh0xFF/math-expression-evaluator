import {
  clearLine,
  createInterface,
  cursorTo,
  emitKeypressEvents,
  Interface,
  Key,
} from 'readline';
import { evaluateExpression } from './interpreter';
import { LexerClassType } from './lexer';
import { InvalidExpression } from './model';
import { Parser, ParserClassType } from './parser';

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

class TtyInput {
  private inputBuffer: string;
  private cursorPos: number;
  private history: string[];
  private historyIndex: number;

  constructor(
    private LexerClass: LexerClassType,
    private ParserClass: ParserClassType,
  ) {
    // Current input state
    this.inputBuffer = '';
    this.cursorPos = 0;
    this.history = [];
    this.historyIndex = -1;

    emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.on('keypress', this.handleKeypress.bind(this));

    this.render();
  }

  private handleKeypress(str: string, key: Key) {
    if (key.ctrl && key.name === 'c') {
      process.exit();
    }

    switch (key.name) {
      case 'return':
        this.handleEnter();
        break;
      case 'left':
        this.moveCursor(-1);
        break;
      case 'right':
        this.moveCursor(1);
        break;
      case 'up':
        this.navigateHistory(-1);
        break;
      case 'down':
        this.navigateHistory(1);
        break;
      case 'home':
        this.cursorPos = 0;
        break;
      case 'end':
        this.cursorPos = this.inputBuffer.length;
        break;
      case 'backspace':
        this.handleBackspace();
        break;
      case 'delete':
        this.handleDelete();
        break;
      default:
        if (str && !key.ctrl && !key.meta) {
          this.insertChar(str);
        }
    }

    this.render();
  }

  private moveCursor(offset: number) {
    const newPos = this.cursorPos + offset;
    if (newPos >= 0 && newPos <= this.inputBuffer.length) {
      this.cursorPos = newPos;
    }
  }

  private navigateHistory(direction: number) {
    const newIndex = this.historyIndex + direction;
    if (newIndex >= -1 && newIndex < this.history.length) {
      this.historyIndex = newIndex;
      if (newIndex === -1) {
        this.inputBuffer = '';
      } else if (this.history[newIndex]) {
        this.inputBuffer = this.history[newIndex];
      }
      this.cursorPos = this.inputBuffer.length;
    }
  }

  private insertChar(char: string) {
    const before = this.inputBuffer.slice(0, this.cursorPos);
    const after = this.inputBuffer.slice(this.cursorPos);
    this.inputBuffer = before + char + after;
    this.cursorPos++;
  }

  private handleBackspace() {
    if (this.cursorPos > 0) {
      const before = this.inputBuffer.slice(0, this.cursorPos - 1);
      const after = this.inputBuffer.slice(this.cursorPos);
      this.inputBuffer = before + after;
      this.cursorPos--;
    }
  }

  private handleDelete() {
    if (this.cursorPos < this.inputBuffer.length) {
      const before = this.inputBuffer.slice(0, this.cursorPos);
      const after = this.inputBuffer.slice(this.cursorPos + 1);
      this.inputBuffer = before + after;
    }
  }

  private handleEnter() {
    console.log(''); // New line
    if (this.inputBuffer.trim()) {
      this.history.push(this.inputBuffer);
      const expression = this.inputBuffer;

      // Process the input here
      const lexer = new this.LexerClass(expression);
      const parser = new this.ParserClass(lexer);
      processExpression(parser, expression);
    } else {
      console.log(`\nEmpty expression\n`);
    }
    this.inputBuffer = '';
    this.cursorPos = 0;
    this.historyIndex = -1;
  }

  private render() {
    // Clear the current line
    clearLine(process.stdout, 0);
    cursorTo(process.stdout, 0);

    // Write prompt and input
    process.stdout.write('> ' + this.inputBuffer);

    // Move cursor to correct position
    cursorTo(process.stdout, this.cursorPos + 2);
  }

  cleanup() {
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false);
    }
  }
}

class ReaderInput {
  private rl: Interface;

  constructor(
    private LexerClass: LexerClassType,
    private ParserClass: ParserClassType,
  ) {
    // Current input state
    this.rl = createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '> ',
    });

    this.rl.on('line', (line) => {
      this.handleLine(line);
    });

    this.rl.prompt();
  }

  private handleLine(line: string) {
    if (line.trim()) {
      const expression = line;

      // Process the input here
      const lexer = new this.LexerClass(expression);
      const parser = new this.ParserClass(lexer);
      processExpression(parser, expression);
    }
    this.rl?.prompt();
  }

  cleanup() {
    this.rl.close();
  }
}

function processExpression(parser: Parser, expression: string) {
  try {
    const ast = parser.parseExpression();
    const result = evaluateExpression(ast);

    console.log(`\nExpression: ${expression}\nResult: ${result}\n`);
  } catch (error) {
    console.log(
      `\nExecution failed: ${(error as InvalidExpression).message}\n`,
    );
  }
}
