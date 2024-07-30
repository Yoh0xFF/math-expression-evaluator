import { evaluateExpression } from '@app/interpreter/interpreter';
import { Lexer } from '@app/lexer/lexer';
import { Parser } from '@app/parser/parser';
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
        const parser = new Parser(lexer);
        const ast = parser.parseExpression();
        console.log(
          `\nExpression: ${expression}\nAST:\n${JSON.stringify(ast, null, 2)}\n`,
        );

        const result = evaluateExpression(ast);
        console.log(`\nExpression: ${expression}\nResult:\n${result}\n`);
      } catch (error) {
        console.error(`\nExecution failed: ${(error as Error).message}\n`);
      }
      prompt();
    }
  });
}

prompt();
