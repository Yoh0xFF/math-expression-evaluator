import { evaluateExpression } from '@root/interpreter/index.ts';
import { InvalidExpression } from '@root/model/index.ts';
import { Parser } from '@root/parser/index.ts';

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
