import chalk from 'chalk';
import { evaluateExpression } from 'interpreter/interpreter';
import { Lexer } from 'lexer/lexer';
import { Parser } from 'parser/parser';
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
          console.log(JSON.stringify(ast, null, 2));

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
