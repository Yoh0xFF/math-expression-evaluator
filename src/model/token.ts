export type TokenType = 'Operand' | 'Operator' | 'Parenthesis' | 'EoE';

export interface Token {
  type: TokenType;
  value: string;
}
