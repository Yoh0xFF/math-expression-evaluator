export * from './ast';
export * from './token';

export class InvalidExpression {
  public message: string;

  constructor(token: string | undefined, index: number) {
    this.message = `Invalid expression, unknow character '${token ?? ''}' at index ${index}`;
  }
}
