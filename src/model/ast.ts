export type Expression =
  | { type: 'Literal'; value: number }
  | { type: 'Unary'; operator: string; right: Expression }
  | { type: 'Binary'; left: Expression; operator: string; right: Expression }
  | { type: 'Group'; expression: Expression };

export type PrecedenceType = 'None' | 'Term' | 'Factor' | 'Unary' | 'Primary';
