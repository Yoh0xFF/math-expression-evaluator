import { LexerType } from '../lexer';
import { Expression, PrecedenceType, Token, TokenType } from '../model';
import { ParserType } from './parser';

export class PrattParser implements ParserType {
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

  constructor(public lexer: LexerType) {
    this.token = lexer.nextToken();
    this.nextToken = lexer.nextToken();
  }

  parseExpression(): Expression {
    return this.parseExpressionWithPrecedence(this.precedence.None);
  }

  private parseExpressionWithPrecedence(precedence: number): Expression {
    const prefixParser = this.prefixParsers.get(this.token.type);
    if (prefixParser == null) {
      throw new Error('Unknow expression');
    }
    let left = prefixParser.bind(this)();

    while (this.nextToken.type != 'EoE' && precedence < this.peekPrecedence()) {
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
      right: this.parseExpressionWithPrecedence(precedence),
    };
  }

  private parseUnary(): Expression {
    const operator = this.token.value;
    this.advance();
    const right = this.parseExpressionWithPrecedence(this.precedence.Unary);
    return { type: 'Unary', operator, right };
  }

  private parseGroup(): Expression {
    this.advance(); // Skip '(' token
    const expression = this.parseExpressionWithPrecedence(
      this.precedence['None'],
    );
    this.advance(); // Skip ')' token
    return { type: 'Group', expression };
  }

  private parsePrimary(): Expression {
    const expression: Expression = {
      type: 'Literal',
      value: parseFloat(this.token.value),
    };
    return expression;
  }

  private peekPrecedence(): number {
    const { type } = this.nextToken;
    return this.precedence[this.tokenPrecedence.get(type) ?? 'None'];
  }

  private advance() {
    this.token = this.nextToken;
    this.nextToken = this.lexer.nextToken();
  }
}
