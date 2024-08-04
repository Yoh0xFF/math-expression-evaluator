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
      this.pickToken().type.startsWith('Operator') &&
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
      this.pickToken().type.startsWith('Operator') &&
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
      this.pickToken().type.startsWith('Operator') &&
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
    if (this.pickToken().type.startsWith('Parenthesis')) {
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
