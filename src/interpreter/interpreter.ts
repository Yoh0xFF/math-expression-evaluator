import { Expression } from '../model';

export function evaluateExpression(expression: Expression): number {
  switch (expression.type) {
    case 'Literal':
      return expression.value;
    case 'Unary': {
      const { operator, right } = expression;
      const value = evaluateExpression(right);

      switch (operator) {
        case '+':
          return 0 + value;
        case '-':
          return 0 - value;
        default:
          throw new Error('Invalid unary operator');
      }
    }
    case 'Binary': {
      const { operator, left, right } = expression;
      const leftValue = evaluateExpression(left);
      const rightValue = evaluateExpression(right);

      switch (operator) {
        case '+':
          return leftValue + rightValue;
        case '-':
          return leftValue - rightValue;
        case '*':
          return leftValue * rightValue;
        case '/':
          if (rightValue === 0) {
            throw new Error('Division by zero');
          }
          return leftValue / rightValue;
        default:
          throw new Error('Unknow binary operator');
      }
    }
    case 'Group':
      return evaluateExpression(expression.expression);
    default:
      throw new Error('Unknow expression');
  }
}
