import { Token } from '@app/lexer';

export class Parser {
  private tokens: Array<Token>;
  private index: number;

  constructor(tokens: Array<Token>) {
    this.tokens = tokens;
    this.index = 0;
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
      expression = new BinaryExpression(expression, operator, right);
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
      expression = new BinaryExpression(expression, operator, right);
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
      return new UnaryExpression(operator, right);
    }

    return this.parsePrimary();
  }

  private parsePrimary(): Expression {
    if (this.pickToken().type === 'Operand') {
      return new LiteralExpression(parseInt(this.getToken().value));
    }
    if (this.pickToken().type === 'Parenthesis') {
      this.getToken(); // Skip '(' token
      const expression = this.parseExpression();
      this.getToken(); // Skip ')' token
      return new GroupingExpression(expression);
    }
    this.getToken();
    return new EofExpression();
  }

  private pickToken(): Token {
    return this.tokens[this.index]!;
  }

  private getToken(): Token {
    return this.isEof() ? this.tokens[this.index]! : this.tokens[this.index++]!;
  }

  private isEof() {
    return this.pickToken().type === 'EOF';
  }
}

export interface Expression {}

export class LiteralExpression implements Expression {
  constructor(public value: number) {}
}

export class UnaryExpression implements Expression {
  constructor(
    public operator: string,
    public right: Expression,
  ) {}
}

export class BinaryExpression implements Expression {
  constructor(
    public left: Expression,
    public operator: string,
    public right: Expression,
  ) {}
}

export class GroupingExpression implements Expression {
  constructor(public expression: Expression) {}
}

export class EofExpression implements Expression {}
