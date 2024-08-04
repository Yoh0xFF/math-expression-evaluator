# Math expression evaluator

Simple math expression evaluator.

Supported operators ordered by precedence:

- Unary operators: `+`, `-`
- Factor operators: `*`, `/`
- Term operators: `+`, `-`

The evaluator supports grouping expression as well.

Examples:

- `2.2 + 2.8`
- `5 * -2`
- `2 + 14 / 2`
- `(1 + 4) * 5 / (10 + -5)`
- `(2 + 7) * 2 + 2.5`

## Configuration

You can set which lexer and parser to use in the `.env` configuration file.

- env variable `LEXER` (supported options are `Regex`, `Scanner`)
- env variavle `PARSER` (supported options are `Recursive`, `Pratt`)

## NPM Commands

- Run program: `npm run start`
- Run program in watch mode: `npm run start:dev`
- Run unit tests: `npm run test`
- Run unit tests in watch mode: `npm run test:dev`
