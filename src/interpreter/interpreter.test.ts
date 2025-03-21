import { appConfig, LexerType, ParserType } from '@root/appConfig.ts';
import { evaluateExpression } from '@root/interpreter/index.ts';
import { Lexer } from '@root/lexer/index.ts';
import { Parser } from '@root/parser/index.ts';
import { strictEqual } from 'node:assert';
import { beforeEach, describe, it, mock } from 'node:test';

describe('Test Interpreter with Regex lexer and Recursive parser', () => {
  runTests('Regex', 'Recursive');
});

describe('Test Interpreter with Regex lexer and Pratt parser', () => {
  runTests('Regex', 'Pratt');
});

describe('Test Interpreter with Scanner lexer and Recursive parser', () => {
  runTests('Scanner', 'Recursive');
});

describe('Test Interpreter with Scanner lexer and Pratt parser', () => {
  runTests('Scanner', 'Pratt');
});

function runTests(lexerType: LexerType, parserType: ParserType) {
  beforeEach(() => {
    mock.method(appConfig, 'getLexerType', () => lexerType);
    mock.method(appConfig, 'getParserType', () => parserType);
  });

  describe('Run tests', () => {
    it('evaluate term operators', () => {
      const expression = '7.2 + 9 - 7.2';
      const parser = new Parser(new Lexer(expression));
      const ast = parser.parseExpression();
      const result = evaluateExpression(ast);

      strictEqual(result, 9);
    });

    it('parse factor operators', () => {
      const expression = '7 * 9 / 7';
      const parser = new Parser(new Lexer(expression));
      const ast = parser.parseExpression();
      const result = evaluateExpression(ast);

      strictEqual(result, 9);
    });

    it('correctly parse operator precedence', () => {
      const expression = '7.2 + 9 * 7';
      const parser = new Parser(new Lexer(expression));
      const ast = parser.parseExpression();
      const result = evaluateExpression(ast);

      strictEqual(result, 70.2);
    });

    it('parse group expression', () => {
      const expression = '(5 + 9) / 2';
      const parser = new Parser(new Lexer(expression));
      const ast = parser.parseExpression();
      const result = evaluateExpression(ast);

      strictEqual(result, 7);
    });

    it('correctly parse unary operator precedence', () => {
      const expression = '5 * -5';
      const parser = new Parser(new Lexer(expression));
      const ast = parser.parseExpression();
      const result = evaluateExpression(ast);

      strictEqual(result, -25);
    });

    it('correctly parse complex expression', () => {
      const expression = '(1 + 4) * 5 / (10 + -5)';
      const parser = new Parser(new Lexer(expression));
      const ast = parser.parseExpression();
      const result = evaluateExpression(ast);

      strictEqual(result, 5);
    });

    it('throw error on division by zero', () => {
      const expression = '(1 + 4) * 5 / (5 + -5)';
      const parser = new Parser(new Lexer(expression));
      const ast = parser.parseExpression();

      try {
        evaluateExpression(ast);
      } catch (error) {
        strictEqual((error as Error).message, 'Division by zero');
      }
    });
  });
}
