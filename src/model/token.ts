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
  type: TokenType;
  value: string;
}
