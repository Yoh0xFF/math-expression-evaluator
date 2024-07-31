import { evaluateExpression } from '@app/interpreter/interpreter';
import { Lexer } from '@app/lexer/lexer';
import { Parser } from '@app/parser/parser';
import chalk from 'chalk';
import { createInterface } from 'readline';

const reader = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt() {
  reader.question(
    chalk.green('Please enter the math expression:\n=====>\t'),
    (expression) => {
      if (expression === 'quit') {
        reader.close();
        console.log(chalk.red('Goodbye!'));
      } else if (expression == null || expression.trim().length === 0) {
        console.log(chalk.red(`\nEmpty expression\n`));
        prompt();
      } else {
        try {
          const lexer = new Lexer(expression);
          const parser = new Parser(lexer);
          const ast = parser.parseExpression();
          const result = evaluateExpression(ast);

          console.log(
            chalk.cyan(`\nExpression: ${expression}\nResult: ${result}\n`),
          );
        } catch (error) {
          console.log(
            chalk.red(`\nExecution failed: ${(error as Error).message}\n`),
          );
        }
        prompt();
      }
    },
  );
}

prompt();
