// AST
export type Expression =
  | { type: 'Literal'; value: number }
  | { type: 'Unary'; operator: string; right: Expression }
  | { type: 'Binary'; left: Expression; operator: string; right: Expression }
  | { type: 'Group'; expression: Expression };

export type PrecedenceType = 'None' | 'Term' | 'Factor' | 'Unary' | 'Primary';

// Token
export type TokenType =
  | 'Operand'
  | 'Operator+'
  | 'Operator-'
  | 'Operator*'
  | 'Operator/'
  | 'Parenthesis('
  | 'Parenthesis)'
  | 'EoE';

export interface Token {
  index: number;
  type: TokenType;
  value: string;
}

// Exception
export class InvalidExpression {
  public message: string;

  constructor(token: string | undefined, index: number) {
    this.message = `Invalid expression, unknow character '${token ?? ''}' at index ${index}`;
  }
}
