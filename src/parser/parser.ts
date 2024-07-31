import { Lexer } from '@app/lexer/lexer';
import { Expression } from '@app/model/ast';
import { Token } from '@app/model/token';

export class Parser {
  private lexer: Lexer;
  private token: Token;
  private nextToken: Token;

  constructor(lexer: Lexer) {
    this.lexer = lexer;
    this.token = lexer.nextToken();
    this.nextToken = lexer.nextToken();
  }

  parseExpression(): Expression {
    return this.parseTerm();
  }

  private parseTerm(): Expression {
    let expression = this.parseFactor();

    while (
      this.pickToken().type === 'Operator' &&
      ['+', '-'].includes(this.pickToken().value)
    ) {
      const operator = this.getToken().value;
      const right = this.parseFactor();
      expression = { type: 'Binary', left: expression, operator, right };
    }

    return expression;
  }

  private parseFactor(): Expression {
    let expression = this.parseUnary();

    while (
      this.pickToken().type === 'Operator' &&
      ['*', '/'].includes(this.pickToken().value)
    ) {
      const operator = this.getToken().value;
      const right = this.parseUnary();
      expression = { type: 'Binary', left: expression, operator, right };
    }

    return expression;
  }

  private parseUnary(): Expression {
    if (
      this.pickToken().type === 'Operator' &&
      ['-', '+'].includes(this.pickToken().value)
    ) {
      const operator = this.getToken().value;
      const right = this.parseUnary();
      return { type: 'Unary', operator, right };
    }

    return this.parsePrimary();
  }

  private parsePrimary(): Expression {
    if (this.pickToken().type === 'Operand') {
      return { type: 'Literal', value: parseFloat(this.getToken().value) };
    }
    if (this.pickToken().type === 'Parenthesis') {
      this.getToken(); // Skip '(' token
      const expression = this.parseExpression();
      this.getToken(); // Skip ')' token
      return { type: 'Group', expression };
    }
    throw new Error('Unknow expression');
  }

  private pickToken(): Token {
    return this.token;
  }

  private getToken(): Token {
    const result = this.token;
    this.token = this.nextToken;
    this.nextToken = this.lexer.nextToken();
    return result;
  }
}
