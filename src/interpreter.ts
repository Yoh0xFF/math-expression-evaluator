import {
  BinaryExpression,
  Expression,
  GroupingExpression,
  LiteralExpression,
  UnaryExpression,
} from '@app/parser';

export function evaluateExpression(expression: Expression): number {
  if (expression instanceof LiteralExpression) {
    return expression.value;
  }

  if (expression instanceof UnaryExpression) {
    const operator = expression.operator;
    const value = evaluateExpression(expression.right);

    switch (operator) {
      case '+':
        return 0 + value;
      case '-':
        return 0 - value;
      default:
        throw new Error('Invalid unary operator');
    }
  }

  if (expression instanceof BinaryExpression) {
    const operator = expression.operator;
    const leftValue = evaluateExpression(expression.left);
    const rightValue = evaluateExpression(expression.right);

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

  if (expression instanceof GroupingExpression) {
    return evaluateExpression(expression.expression);
  }

  throw new Error('Unknow expression');
}
