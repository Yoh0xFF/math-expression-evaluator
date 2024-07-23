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
      const lexer = new Lexer(expression);
      lexer.tokenize();
      console.log('==> ', expression);
      prompt();
    }
  });
}

prompt();
