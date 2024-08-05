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
