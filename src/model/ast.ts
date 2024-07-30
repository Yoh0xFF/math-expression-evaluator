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
