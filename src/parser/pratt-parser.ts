import { Lexer } from '@root/lexer/index.ts';
import {
  Expression,
  InvalidExpression,
  PrecedenceType,
  Token,
  TokenType,
} from '@root/model/index.ts';
import { Parser } from '@root/parser/index.ts';

export class PrattParser implements Parser {
  private token: Token;
  private nextToken: Token;

  private precedence: {
    [key in PrecedenceType]: number;
  } = {
    None: 0,
    Term: 1,
    Factor: 2,
    Unary: 3,
    Primary: 4,
  };
  private tokenPrecedence: Map<TokenType, PrecedenceType> = new Map([
    ['Operator+', 'Term'],
    ['Operator-', 'Term'],
    ['Operator*', 'Factor'],
    ['Operator/', 'Factor'],
  ]);

  private prefixParsers: Map<TokenType, () => Expression> = new Map([
    ['Operand', this.parsePrimary],
    ['Operator-', this.parseUnary],
    ['Parenthesis(', this.parseGroup],
  ]);
  private infixParsers: Map<TokenType, (left: Expression) => Expression> =
    new Map([
      ['Operator+', this.parseBinary],
      ['Operator-', this.parseBinary],
      ['Operator*', this.parseBinary],
      ['Operator/', this.parseBinary],
    ]);

  constructor(public lexer: Lexer) {
    this.token = lexer.nextToken();
    this.nextToken = lexer.nextToken();
  }

  parseExpression(): Expression {
    const expression = this.parseRecursive(this.precedence.None);

    if (this.nextToken.type !== 'EoE') {
      throw new InvalidExpression(
        this.nextToken.value[0],
        this.nextToken.index,
      );
    }

    return expression;
  }

  private parseRecursive(precedence: number): Expression {
    const prefixParser = this.prefixParsers.get(this.token.type);
    if (prefixParser == null) {
      throw new InvalidExpression(this.token.value[0], this.token.index);
    }
    let left = prefixParser.bind(this)();

    while (
      this.nextToken.type != 'EoE' &&
      precedence < this.nextTokenPrecedence()
    ) {
      const infixParser = this.infixParsers.get(this.nextToken.type);
      if (infixParser == null) {
        return left;
      }

      this.advance();
      left = infixParser.bind(this)(left);
    }

    return left;
  }

  private parseBinary(left: Expression): Expression {
    const { type, value: operator } = this.token;
    const precedence =
      this.precedence[this.tokenPrecedence.get(type) ?? 'None'];
    this.advance();

    return {
      type: 'Binary',
      operator,
      left,
      right: this.parseRecursive(precedence),
    };
  }

  private parseUnary(): Expression {
    const { value: operator } = this.token;
    this.advance();

    return {
      type: 'Unary',
      operator,
      right: this.parseRecursive(this.precedence.Unary),
    };
  }

  private parseGroup(): Expression {
    this.advance(); // Skip '(' token
    const expression = this.parseRecursive(this.precedence['None']);
    this.advance(); // move to ')' token

    if (this.token.type !== 'Parenthesis)') {
      throw new InvalidExpression(this.token.value[0], this.token.index);
    }

    return { type: 'Group', expression };
  }

  private parsePrimary(): Expression {
    const expression: Expression = {
      type: 'Literal',
      value: parseFloat(this.token.value),
    };
    return expression;
  }

  private nextTokenPrecedence(): number {
    const { type } = this.nextToken;
    return this.precedence[this.tokenPrecedence.get(type) ?? 'None'];
  }

  private advance() {
    this.token = this.nextToken;
    this.nextToken = this.lexer.nextToken();
  }
}
