import { deepStrictEqual, strictEqual } from 'node:assert';
import { describe, it } from 'node:test';
import { Lexer } from '../lexer/lexer';

describe('tests/lexer', () => {
  it('parse term operators', () => {
    const expression = '7 + 9 - 7';
    const lexer = new Lexer(expression);
    deepStrictEqual(lexer.nextToken(), { type: 'Operand', value: '7' });
    deepStrictEqual(lexer.nextToken(), { type: 'Operator', value: '+' });
    deepStrictEqual(lexer.nextToken(), { type: 'Operand', value: '9' });
    deepStrictEqual(lexer.nextToken(), { type: 'Operator', value: '-' });
    deepStrictEqual(lexer.nextToken(), { type: 'Operand', value: '7' });
  });

  it('parse factor operators', () => {
    const expression = '7 * 9 / 7';
    const lexer = new Lexer(expression);
    deepStrictEqual(lexer.nextToken(), { type: 'Operand', value: '7' });
    deepStrictEqual(lexer.nextToken(), { type: 'Operator', value: '*' });
    deepStrictEqual(lexer.nextToken(), { type: 'Operand', value: '9' });
    deepStrictEqual(lexer.nextToken(), { type: 'Operator', value: '/' });
    deepStrictEqual(lexer.nextToken(), { type: 'Operand', value: '7' });
  });

  it('parse float numbers', () => {
    const expression = '7.9 * 9.7';
    const lexer = new Lexer(expression);
    deepStrictEqual(lexer.nextToken(), { type: 'Operand', value: '7.9' });
    deepStrictEqual(lexer.nextToken(), { type: 'Operator', value: '*' });
    deepStrictEqual(lexer.nextToken(), { type: 'Operand', value: '9.7' });
  });

  it('skip whitespace', () => {
    const expression = ' 7   * \t\n   9 \n ';
    const lexer = new Lexer(expression);
    deepStrictEqual(lexer.nextToken(), { type: 'Operand', value: '7' });
    deepStrictEqual(lexer.nextToken(), { type: 'Operator', value: '*' });
    deepStrictEqual(lexer.nextToken(), { type: 'Operand', value: '9' });
  });

  it('parse group expression', () => {
    const expression = '(7 + 9) * 11';
    const lexer = new Lexer(expression);
    deepStrictEqual(lexer.nextToken(), { type: 'Parenthesis', value: '(' });
    deepStrictEqual(lexer.nextToken(), { type: 'Operand', value: '7' });
    deepStrictEqual(lexer.nextToken(), { type: 'Operator', value: '+' });
    deepStrictEqual(lexer.nextToken(), { type: 'Operand', value: '9' });
    deepStrictEqual(lexer.nextToken(), { type: 'Parenthesis', value: ')' });
    deepStrictEqual(lexer.nextToken(), { type: 'Operator', value: '*' });
    deepStrictEqual(lexer.nextToken(), { type: 'Operand', value: '11' });
  });

  it('parse complex expression', () => {
    const expression = '(1 + 4) * 5 / (10 + -5)';
    const lexer = new Lexer(expression);
    deepStrictEqual(lexer.nextToken(), { type: 'Parenthesis', value: '(' });
    deepStrictEqual(lexer.nextToken(), { type: 'Operand', value: '1' });
    deepStrictEqual(lexer.nextToken(), { type: 'Operator', value: '+' });
    deepStrictEqual(lexer.nextToken(), { type: 'Operand', value: '4' });
    deepStrictEqual(lexer.nextToken(), { type: 'Parenthesis', value: ')' });
    deepStrictEqual(lexer.nextToken(), { type: 'Operator', value: '*' });
    deepStrictEqual(lexer.nextToken(), { type: 'Operand', value: '5' });
    deepStrictEqual(lexer.nextToken(), { type: 'Operator', value: '/' });
    deepStrictEqual(lexer.nextToken(), { type: 'Parenthesis', value: '(' });
    deepStrictEqual(lexer.nextToken(), { type: 'Operand', value: '10' });
    deepStrictEqual(lexer.nextToken(), { type: 'Operator', value: '+' });
    deepStrictEqual(lexer.nextToken(), { type: 'Operator', value: '-' });
    deepStrictEqual(lexer.nextToken(), { type: 'Operand', value: '5' });
    deepStrictEqual(lexer.nextToken(), { type: 'Parenthesis', value: ')' });
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
