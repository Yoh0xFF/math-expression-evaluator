import { Lexer } from '@app/lexer';
import { createInterface } from 'readline';

const reader = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt() {
  reader.question('Please enter the math expression:\n', (expression) => {
    if (expression === 'quit') {
      reader.close();
      console.log('Goodbye!');
    } else {
      try {
        const lexer = new Lexer(expression);
        const tokens = lexer.tokenize();
        console.log(
          `\nExpression: ${expression}\nTokens:\n${JSON.stringify(tokens, null, 2)}\n`,
        );
      } catch (error) {
        console.error(`\nExecution failed: ${(error as Error).message}\n`);
      }
      prompt();
    }
  });
}

prompt();
