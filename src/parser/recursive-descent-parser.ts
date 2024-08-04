import { LexerType } from '../lexer';
import { Expression, Token } from '../model';
import { ParserType } from './parser';

export class RecursiveDescentParser implements ParserType {
  private token: Token;
  private nextToken: Token;

  constructor(public lexer: LexerType) {
    this.token = lexer.nextToken();
    this.nextToken = lexer.nextToken();
  }

  parseExpression(): Expression {
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
    if (this.token.type.startsWith('Parenthesis')) {
      this.advance(); // Skip '(' token
      const expression = this.parseExpression();
      this.advance(); // Skip ')' token
      return { type: 'Group', expression };
    }
    throw new Error('Unknow expression');
  }

  private advance() {
    this.token = this.nextToken;
    this.nextToken = this.lexer.nextToken();
  }
}
