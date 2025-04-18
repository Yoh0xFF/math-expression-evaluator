import { Lexer } from '@root/lexer/index.ts';
import { Expression, InvalidExpression, Token } from '@root/model/index.ts';
import { ParserInterface } from '@root/parser/interface.ts';

export class RecursiveDescentParser implements ParserInterface {
  private token: Token;
  private nextToken: Token;

  constructor(public lexer: Lexer) {
    this.token = lexer.nextToken();
    this.nextToken = lexer.nextToken();
  }

  parseExpression(): Expression {
    const expression = this.parseRecursive();

    if (this.token.type !== 'EoE') {
      throw new InvalidExpression(this.token.value[0], this.token.index);
    }

    return expression;
  }

  private parseRecursive(): Expression {
    return this.parseTerm();
  }

  private parseTerm(): Expression {
    let expression = this.parseFactor();

    while (
      this.token.type.startsWith('Operator') &&
      ['+', '-'].includes(this.token.value)
    ) {
      const operator = this.token.value;
      this.advance();
      const right = this.parseFactor();
      expression = { type: 'Binary', left: expression, operator, right };
    }

    return expression;
  }

  private parseFactor(): Expression {
    let expression = this.parseUnary();

    while (
      this.token.type.startsWith('Operator') &&
      ['*', '/'].includes(this.token.value)
    ) {
      const operator = this.token.value;
      this.advance();
      const right = this.parseUnary();
      expression = { type: 'Binary', left: expression, operator, right };
    }

    return expression;
  }

  private parseUnary(): Expression {
    if (
      this.token.type.startsWith('Operator') &&
      ['-', '+'].includes(this.token.value)
    ) {
      const operator = this.token.value;
      this.advance();
      const right = this.parseUnary();
      return { type: 'Unary', operator, right };
    }

    return this.parsePrimary();
  }

  private parsePrimary(): Expression {
    if (this.token.type === 'Operand') {
      const expression: Expression = {
        type: 'Literal',
        value: parseFloat(this.token.value),
      };
      this.advance();
      return expression;
    }

    if (this.token.type === 'Parenthesis(') {
      this.advance(); // Skip '(' token
      const expression = this.parseRecursive();

      if (this.token.value !== ')') {
        throw new InvalidExpression(this.token.value[0], this.token.index);
      }
      this.advance(); // Skip ')' token

      return { type: 'Group', expression };
    }

    throw new InvalidExpression(this.token.value[0], this.token.index);
  }

  private advance() {
    this.token = this.nextToken;
    this.nextToken = this.lexer.nextToken();
  }
}
