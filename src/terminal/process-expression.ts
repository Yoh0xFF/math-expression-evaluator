import { evaluateExpression } from 'interpreter';
import { InvalidExpression } from 'model';
import { Parser } from 'parser';

export function processExpression(parser: Parser, expression: string) {
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
