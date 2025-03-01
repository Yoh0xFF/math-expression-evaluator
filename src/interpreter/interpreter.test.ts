import { evaluateExpression } from 'interpreter';
import { getLexerClass, LexerClassType } from 'lexer';
import { strictEqual } from 'node:assert';
import { describe, it } from 'node:test';
import { getParserClass, ParserClassType } from 'parser';

describe('Test Interpreter with Regex lexer and Recursive parser', () => {
  const Lexer = getLexerClass('Regex');
  const Parser = getParserClass('Recursive');
  runTests(Lexer, Parser);
});

describe('Test Interpreter with Regex lexer and Pratt parser', () => {
  const Lexer = getLexerClass('Regex');
  const Parser = getParserClass('Pratt');
  runTests(Lexer, Parser);
});

describe('Test Interpreter with Scanner lexer and Recursive parser', () => {
  const Lexer = getLexerClass('Scanner');
  const Parser = getParserClass('Recursive');
  runTests(Lexer, Parser);
});

describe('Test Interpreter with Scanner lexer and Pratt parser', () => {
  const Lexer = getLexerClass('Scanner');
  const Parser = getParserClass('Pratt');
  runTests(Lexer, Parser);
});

function runTests(LexerClass: LexerClassType, ParserClass: ParserClassType) {
  describe('Run tests', () => {
    it('evaluate term operators', () => {
      const expression = '7.2 + 9 - 7.2';
      const parser = new ParserClass(new LexerClass(expression));
      const ast = parser.parseExpression();
      const result = evaluateExpression(ast);

      strictEqual(result, 9);
    });

    it('parse factor operators', () => {
      const expression = '7 * 9 / 7';
      const parser = new ParserClass(new LexerClass(expression));
      const ast = parser.parseExpression();
      const result = evaluateExpression(ast);

      strictEqual(result, 9);
    });

    it('correctly parse operator precedence', () => {
      const expression = '7.2 + 9 * 7';
      const parser = new ParserClass(new LexerClass(expression));
      const ast = parser.parseExpression();
      const result = evaluateExpression(ast);

      strictEqual(result, 70.2);
    });

    it('parse group expression', () => {
      const expression = '(5 + 9) / 2';
      const parser = new ParserClass(new LexerClass(expression));
      const ast = parser.parseExpression();
      const result = evaluateExpression(ast);

      strictEqual(result, 7);
    });

    it('correctly parse unary operator precedence', () => {
      const expression = '5 * -5';
      const parser = new ParserClass(new LexerClass(expression));
      const ast = parser.parseExpression();
      const result = evaluateExpression(ast);

      strictEqual(result, -25);
    });

    it('correctly parse complex expression', () => {
      const expression = '(1 + 4) * 5 / (10 + -5)';
      const parser = new ParserClass(new LexerClass(expression));
      const ast = parser.parseExpression();
      const result = evaluateExpression(ast);

      strictEqual(result, 5);
    });

    it('throw error on division by zero', () => {
      const expression = '(1 + 4) * 5 / (5 + -5)';
      const parser = new ParserClass(new LexerClass(expression));
      const ast = parser.parseExpression();

      try {
        evaluateExpression(ast);
      } catch (error) {
        strictEqual((error as Error).message, 'Division by zero');
      }
    });
  });
}
