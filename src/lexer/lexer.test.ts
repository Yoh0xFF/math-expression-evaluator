import { Lexer } from '@root/lexer/index.ts';
import { deepStrictEqual, strictEqual } from 'node:assert';
import { describe, it } from 'node:test';

describe('Test LexerWithRegex', () => {
  process.env['LEXER'] = 'Regex';
  runTests();
});

describe('Test LexerWirthScanner', function () {
  process.env['LEXER'] = 'Scanner';
  runTests();
});

function runTests() {
  describe('Run tests', () => {
    it('parse term operators', () => {
      const expression = '7 + 9 - 7';
      const lexer = new Lexer(expression);
      deepStrictEqual(lexer.nextToken(), {
        index: 0,
        type: 'Operand',
        value: '7',
      });
      deepStrictEqual(lexer.nextToken(), {
        index: 2,
        type: 'Operator+',
        value: '+',
      });
      deepStrictEqual(lexer.nextToken(), {
        index: 4,
        type: 'Operand',
        value: '9',
      });
      deepStrictEqual(lexer.nextToken(), {
        index: 6,
        type: 'Operator-',
        value: '-',
      });
      deepStrictEqual(lexer.nextToken(), {
        index: 8,
        type: 'Operand',
        value: '7',
      });
    });

    it('parse factor operators', () => {
      const expression = '7 * 9 / 7';
      const lexer = new Lexer(expression);
      deepStrictEqual(lexer.nextToken(), {
        index: 0,
        type: 'Operand',
        value: '7',
      });
      deepStrictEqual(lexer.nextToken(), {
        index: 2,
        type: 'Operator*',
        value: '*',
      });
      deepStrictEqual(lexer.nextToken(), {
        index: 4,
        type: 'Operand',
        value: '9',
      });
      deepStrictEqual(lexer.nextToken(), {
        index: 6,
        type: 'Operator/',
        value: '/',
      });
      deepStrictEqual(lexer.nextToken(), {
        index: 8,
        type: 'Operand',
        value: '7',
      });
    });

    it('parse float numbers', () => {
      const expression = '7.9 * 9.7';
      const lexer = new Lexer(expression);
      deepStrictEqual(lexer.nextToken(), {
        index: 0,
        type: 'Operand',
        value: '7.9',
      });
      deepStrictEqual(lexer.nextToken(), {
        index: 4,
        type: 'Operator*',
        value: '*',
      });
      deepStrictEqual(lexer.nextToken(), {
        index: 6,
        type: 'Operand',
        value: '9.7',
      });
    });

    it('skip whitespace', () => {
      const expression = ' 7   * \t\n  9 \n ';
      const lexer = new Lexer(expression);
      deepStrictEqual(lexer.nextToken(), {
        index: 1,
        type: 'Operand',
        value: '7',
      });
      deepStrictEqual(lexer.nextToken(), {
        index: 5,
        type: 'Operator*',
        value: '*',
      });
      deepStrictEqual(lexer.nextToken(), {
        index: 11,
        type: 'Operand',
        value: '9',
      });
    });

    it('parse group expression', () => {
      const expression = '(7 + 9) * 11';
      const lexer = new Lexer(expression);
      deepStrictEqual(lexer.nextToken(), {
        index: 0,
        type: 'Parenthesis(',
        value: '(',
      });
      deepStrictEqual(lexer.nextToken(), {
        index: 1,
        type: 'Operand',
        value: '7',
      });
      deepStrictEqual(lexer.nextToken(), {
        index: 3,
        type: 'Operator+',
        value: '+',
      });
      deepStrictEqual(lexer.nextToken(), {
        index: 5,
        type: 'Operand',
        value: '9',
      });
      deepStrictEqual(lexer.nextToken(), {
        index: 6,
        type: 'Parenthesis)',
        value: ')',
      });
      deepStrictEqual(lexer.nextToken(), {
        index: 8,
        type: 'Operator*',
        value: '*',
      });
      deepStrictEqual(lexer.nextToken(), {
        index: 10,
        type: 'Operand',
        value: '11',
      });
    });

    it('parse complex expression', () => {
      const expression = '(1 + 4) * 5 / (10 + -5)';
      const lexer = new Lexer(expression);
      deepStrictEqual(lexer.nextToken(), {
        index: 0,
        type: 'Parenthesis(',
        value: '(',
      });
      deepStrictEqual(lexer.nextToken(), {
        index: 1,
        type: 'Operand',
        value: '1',
      });
      deepStrictEqual(lexer.nextToken(), {
        index: 3,
        type: 'Operator+',
        value: '+',
      });
      deepStrictEqual(lexer.nextToken(), {
        index: 5,
        type: 'Operand',
        value: '4',
      });
      deepStrictEqual(lexer.nextToken(), {
        index: 6,
        type: 'Parenthesis)',
        value: ')',
      });
      deepStrictEqual(lexer.nextToken(), {
        index: 8,
        type: 'Operator*',
        value: '*',
      });
      deepStrictEqual(lexer.nextToken(), {
        index: 10,
        type: 'Operand',
        value: '5',
      });
      deepStrictEqual(lexer.nextToken(), {
        index: 12,
        type: 'Operator/',
        value: '/',
      });
      deepStrictEqual(lexer.nextToken(), {
        index: 14,
        type: 'Parenthesis(',
        value: '(',
      });
      deepStrictEqual(lexer.nextToken(), {
        index: 15,
        type: 'Operand',
        value: '10',
      });
      deepStrictEqual(lexer.nextToken(), {
        index: 18,
        type: 'Operator+',
        value: '+',
      });
      deepStrictEqual(lexer.nextToken(), {
        index: 20,
        type: 'Operator-',
        value: '-',
      });
      deepStrictEqual(lexer.nextToken(), {
        index: 21,
        type: 'Operand',
        value: '5',
      });
      deepStrictEqual(lexer.nextToken(), {
        index: 22,
        type: 'Parenthesis)',
        value: ')',
      });
    });

    it('throw error for invalid expression', () => {
      const expression = '7.9.1 + 9';
      try {
        const lexer = new Lexer(expression);
        lexer.nextToken();
      } catch (error) {
        strictEqual(
          (error as Error).message,
          "Invalid expression, unknow character '.' at index 3",
        );
      }
    });
  });
}
