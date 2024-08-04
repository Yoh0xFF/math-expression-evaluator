import chalk from 'chalk';
import { config } from 'dotenv';
import { createInterface } from 'readline';
import { evaluateExpression } from './interpreter';
import { LexerType, RegexLexer, ScannerLexer } from './lexer';
import { ParserType, PrattParser, RecursiveDescentParser } from './parser';

config();

// Select which lexer to use
const lexerConfig = process.env['LEXER'] ?? 'regex';
console.log(chalk.red(`Using the ${lexerConfig} lexer.`));
const Lexer: new (expression: string) => LexerType =
  lexerConfig == 'regex' ? RegexLexer : ScannerLexer;

// Select which parser to use
const parserConfig = process.env['PARSER'] ?? 'recursive';
console.log(chalk.red(`Using the ${parserConfig} parser.`));
export const Parser: new (lexer: LexerType) => ParserType =
  parserConfig == 'recursive' ? RecursiveDescentParser : PrattParser;

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
