import path from 'node:path'

import { RuleTester } from '@typescript-eslint/rule-tester'
import tseslint from 'typescript-eslint'
import * as vitest from 'vitest'

import { rule } from './enforce-error-handling.js'

RuleTester.afterAll = vitest.afterAll
RuleTester.it = vitest.it
RuleTester.itOnly = vitest.it.only
RuleTester.describe = vitest.describe

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      projectService: {
        allowDefaultProject: ['*.ts*'],
        defaultProject: 'tsconfig.json',
      },
      tsconfigRootDir: path.join(__dirname, '../..'),
    },
  },
})

ruleTester.run('enforce-error-handling', rule, {
  valid: [
    `
      function test(): void {}
      const a = test();
    `,
    `
      function test(): void | Error {}
      const a = test()
      if (a instanceof Error) {
        // do something
      }
    `,
    `
      class CustomError extends Error {}
      function test(): void | CustomError {}
      const a = test()
      if (a instanceof CustomError) {
        // do something
      }
    `,
    `
      function test(): Promise<void | Error> {}
      const a = await test()
      if (a instanceof Error) {
        // do something
      }
    `,
    `
      class CustomError extends Error {}
      function test(): Promise<void | CustomError> {}
      const a = await test()
      if (a instanceof CustomError) {
        // do something
      }
    `,
    `
      class CustomError extends Error {
        constructor() {
          super('Custom error')
        }
      }
    `,
    `
      class CustomError extends Error {
        constructor() {
          super('Custom error')
        }
      }
      class NestedCustomError extends CustomError {
        constructor() {
          super('Nested custom error')
        }
      }
    `,
    `
      function create(): Error | void {}
      let durationMs = true ? create() : undefined
      if (durationMs instanceof Error) {
        durationMs = undefined
      }
    `,
    `
      function returnsError(): Error {}
      function passesAlongError() {
        return returnsError()
      }
    `,
    `
      function returnsError(): Error {}
      function passesAlongError() {
        const result = returnsError()
        return result
      }
    `,
    `
      function returnsError(): Error {}
      const result = returnsError()
      expect(result).toEqual({})
    `,
    `
      function returnsErrorOrUndefined(): Error | undefined {}
      const result = returnsErrorOrUndefined()
      if (result) {
        // handle error
      }
    `,
    `
      class CustomError1 extends Error {}
      class CustomError2 extends Error {}
      function test(): Promise<CustomError1 | CustomError2> {}
      const a = test()
      if (a instanceof CustomError1) {
        // handle CustomError1
      } else if (a instanceof CustomError2) {
        // handle CustomError2
      }
    `,
    `
      class CustomError1 extends Error {}
      class CustomError2 extends Error {}
      function test(): Promise<CustomError1 | CustomError2> {}
      const a = test()
      if (a instanceof Error) {
        // handle all errors in one
      }
    `,
  ],
  invalid: [
    {
      code: `
        function test(): void | Error {}
        test()
      `,
      errors: [
        {
          column: 9,
          endColumn: 15,
          line: 3,
          endLine: 3,
          messageId: 'enforceErrorHandling',
        },
      ],
    },
    {
      code: `
        function test(): void | Error {}
        const a = test()
      `,
      errors: [
        {
          column: 19,
          endColumn: 25,
          line: 3,
          endLine: 3,
          messageId: 'enforceErrorHandling',
        },
      ],
    },
    {
      code: `
        class CustomError extends Error {}
        function test(): void | CustomError {}
        test()
      `,
      errors: [
        {
          column: 9,
          endColumn: 15,
          line: 4,
          endLine: 4,
          messageId: 'enforceErrorHandling',
        },
      ],
    },
    {
      code: `
        class CustomError extends Error {}
        function test(): void | CustomError {}
        const a = test()
      `,
      errors: [
        {
          column: 19,
          endColumn: 25,
          line: 4,
          endLine: 4,
          messageId: 'enforceErrorHandling',
        },
      ],
    },
    // async
    {
      code: `
        function test(): Promise<void | Error> {}
        test()
      `,
      errors: [
        {
          column: 9,
          endColumn: 15,
          line: 3,
          endLine: 3,
          messageId: 'enforceErrorHandling',
        },
      ],
    },
    {
      code: `
        function test(): Promise<void | Error> {}
        const a = test()
      `,
      errors: [
        {
          column: 19,
          endColumn: 25,
          line: 3,
          endLine: 3,
          messageId: 'enforceErrorHandling',
        },
      ],
    },
    {
      code: `
        class CustomError extends Error {}
        function test(): Promise<void | CustomError> {}
        test()
      `,
      errors: [
        {
          column: 9,
          endColumn: 15,
          line: 4,
          endLine: 4,
          messageId: 'enforceErrorHandling',
        },
      ],
    },
    {
      code: `
        class CustomError extends Error {}
        function test(): Promise<void | CustomError> {}
        const a = test()
      `,
      errors: [
        {
          column: 19,
          endColumn: 25,
          line: 4,
          endLine: 4,
          messageId: 'enforceErrorHandling',
        },
      ],
    },
    {
      code: `
        class CustomError1 extends Error {}
        class CustomError2 extends Error {}
        function test(): Promise<CustomError1 | CustomError2> {}
        const a = test()
        if (a instanceof CustomError1) {
          // only handle CustomError1
        }
      `,
      errors: [
        {
          column: 19,
          endColumn: 25,
          line: 5,
          endLine: 5,
          messageId: 'enforceErrorHandling',
        },
      ],
    },
  ],
})
