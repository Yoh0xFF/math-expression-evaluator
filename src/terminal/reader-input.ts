import { evaluateExpression } from '@root/interpreter/index.ts';
import { Lexer } from '@root/lexer/index.ts';
import { InvalidExpression } from '@root/model/index.ts';
import { Parser } from '@root/parser/index.ts';
import { createInterface, Interface } from 'readline';

export class ReaderInput {
  private rl: Interface;

  constructor() {
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
      const lexer = new Lexer(expression);
      const parser = new Parser(lexer);

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
    this.rl?.prompt();
  }

  cleanup() {
    this.rl.close();
  }
}
