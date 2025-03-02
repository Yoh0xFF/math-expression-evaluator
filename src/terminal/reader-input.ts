import { LexerClassType } from '@root/lexer/mod';
import { ParserClassType } from '@root/parser/mod';
import { processExpression } from '@root/terminal/process-expression';
import { createInterface, Interface } from 'readline';

export class ReaderInput {
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
