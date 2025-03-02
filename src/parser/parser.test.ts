import { deepStrictEqual, fail, strictEqual } from 'node:assert';
import { describe, it } from 'node:test';
import { getLexerClass } from '../lexer/mod';
import { ParserClassType } from './parser';
import { PrattParser } from './pratt-parser';
import { RecursiveDescentParser } from './recursive-descent-parser';

const Lexer = getLexerClass('Regex');

describe('Test PrattParser', function () {
  runTests(PrattParser);
});

describe('Test RecursiveDescentParser', () => {
  runTests(RecursiveDescentParser);
});

function runTests(ParserClass: ParserClassType) {
  describe('Run tests', () => {
    it('parse term operators', () => {
      const expression = '7 + 9 - 7';
      const parser = new ParserClass(new Lexer(expression));
      const ast = parser.parseExpression();

      deepStrictEqual(ast, {
        type: 'Binary',
        left: {
          type: 'Binary',
          left: {
            type: 'Literal',
            value: 7,
          },
          operator: '+',
          right: {
            type: 'Literal',
            value: 9,
          },
        },
        operator: '-',
        right: {
          type: 'Literal',
          value: 7,
        },
      });
    });

    it('parse factor operators', () => {
      const expression = '7 * 9 / 7';
      const parser = new ParserClass(new Lexer(expression));
      const ast = parser.parseExpression();

      deepStrictEqual(ast, {
        type: 'Binary',
        left: {
          type: 'Binary',
          left: {
            type: 'Literal',
            value: 7,
          },
          operator: '*',
          right: {
            type: 'Literal',
            value: 9,
          },
        },
        operator: '/',
        right: {
          type: 'Literal',
          value: 7,
        },
      });
    });

    it('correctly parse operator precedence', () => {
      const expression = '7 + 9 * 7';
      const parser = new ParserClass(new Lexer(expression));
      const ast = parser.parseExpression();

      deepStrictEqual(ast, {
        type: 'Binary',
        left: {
          type: 'Literal',
          value: 7,
        },
        operator: '+',
        right: {
          type: 'Binary',
          left: {
            type: 'Literal',
            value: 9,
          },
          operator: '*',
          right: {
            type: 'Literal',
            value: 7,
          },
        },
      });
    });

    it('parse group expression', () => {
      const expression = '(5 + 9) / 2';
      const parser = new ParserClass(new Lexer(expression));
      const ast = parser.parseExpression();

      deepStrictEqual(ast, {
        type: 'Binary',
        left: {
          type: 'Group',
          expression: {
            type: 'Binary',
            left: {
              type: 'Literal',
              value: 5,
            },
            operator: '+',
            right: {
              type: 'Literal',
              value: 9,
            },
          },
        },
        operator: '/',
        right: {
          type: 'Literal',
          value: 2,
        },
      });
    });

    it('correctly parse unary operator precedence', () => {
      const expression = '5 * -5';
      const parser = new ParserClass(new Lexer(expression));
      const ast = parser.parseExpression();

      deepStrictEqual(ast, {
        type: 'Binary',
        left: {
          type: 'Literal',
          value: 5,
        },
        operator: '*',
        right: {
          type: 'Unary',
          operator: '-',
          right: {
            type: 'Literal',
            value: 5,
          },
        },
      });
    });

    it('correctly parse complex expression', () => {
      const expression = '(1 + 4) * 5 / (10 + -5)';
      const parser = new ParserClass(new Lexer(expression));
      const ast = parser.parseExpression();

      deepStrictEqual(ast, {
        type: 'Binary',
        left: {
          type: 'Binary',
          left: {
            type: 'Group',
            expression: {
              type: 'Binary',
              left: {
                type: 'Literal',
                value: 1,
              },
              operator: '+',
              right: {
                type: 'Literal',
                value: 4,
              },
            },
          },
          operator: '*',
          right: {
            type: 'Literal',
            value: 5,
          },
        },
        operator: '/',
        right: {
          type: 'Group',
          expression: {
            type: 'Binary',
            left: {
              type: 'Literal',
              value: 10,
            },
            operator: '+',
            right: {
              type: 'Unary',
              operator: '-',
              right: {
                type: 'Literal',
                value: 5,
              },
            },
          },
        },
      });
    });

    it('throw error for invalid parentheses', () => {
      const expression = '(1 + 4( * 5';
      const parser = new ParserClass(new Lexer(expression));

      try {
        parser.parseExpression();
        fail('Should not reach');
      } catch (error) {
        strictEqual(
          (error as Error).message,
          "Invalid expression, unknow character '(' at index 6",
        );
      }
    });

    it('throw error for missing right parentheses', () => {
      const expression = '(1 + 4 * 5';
      const parser = new ParserClass(new Lexer(expression));

      try {
        parser.parseExpression();
        fail('Should not reach');
      } catch (error) {
        strictEqual(
          (error as Error).message,
          "Invalid expression, unknow character ';' at index 10",
        );
      }
    });

    it('throw error for missing left parentheses', () => {
      const expression = '1 + 4) * 5';
      const parser = new ParserClass(new Lexer(expression));

      try {
        parser.parseExpression();
        fail('Should not reach');
      } catch (error) {
        strictEqual(
          (error as Error).message,
          "Invalid expression, unknow character ')' at index 5",
        );
      }
    });

    it('throw error for invalid unary operator', () => {
      const expression = '1 + *5';
      const parser = new ParserClass(new Lexer(expression));

      try {
        parser.parseExpression();
        fail('Should not reach');
      } catch (error) {
        strictEqual(
          (error as Error).message,
          "Invalid expression, unknow character '*' at index 4",
        );
      }
    });
  });
}
