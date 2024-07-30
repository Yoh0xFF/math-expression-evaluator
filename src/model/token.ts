export type TokenType = 'Operand' | 'Operator' | 'Parenthesis' | 'END';

export interface Token {
  type: TokenType;
  value: string;
}
