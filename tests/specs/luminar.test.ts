import { describe, expect, test } from 'vitest'
import { spy } from 'nanospy'
import { mockEnvFunctions } from '../utils/mock-env-functions'
import { cli } from '../../src/index'

describe('luminars', () => {
   test('has return type & callback', () => {
      const callback = spy()
      const argv = cli(
         {
            parameters: ['<value-a>', '[value-B]'],
            luminars: {
               luminarA: String,
               luminarB: {
                  type: Number,
               },
            },
         },
         (parsed) => {
            expect<string | undefined>(parsed.luminars.luminarA).toBe('valueA')
            expect<number | undefined>(parsed.luminars.luminarB).toBe(123)
            callback()
         },
         ['--luminarA', 'valueA', '--luminarB', '123', 'valueA', 'valueB'],
      )

      if (!argv.command) {
         expect<string>(argv._.valueA).toBe('valueA')
         expect<string | undefined>(argv._.valueB).toBe('valueB')
         expect<string | undefined>(argv.luminars.luminarA).toBe('valueA')
         expect<number | undefined>(argv.luminars.luminarB).toBe(123)
         expect(callback.called).toBe(true)
      }
   })

   describe('version', () => {
      test('disabled', () => {
         const mocked = mockEnvFunctions()
         const parsed = cli(
            {},
            (p) => {
               expect<{
                  version?: undefined
                  help: boolean | undefined
               }>(p.luminars).toEqual({})
            },
            ['--version'],
         )
         mocked.restore()

         expect<{
            version?: undefined
            help: boolean | undefined
         }>(parsed.luminars).toEqual({})
         expect(mocked.consoleLog.called).toBe(false)
         expect(mocked.processExit.called).toBe(false)
      })

      test('enabled', () => {
         const mocked = mockEnvFunctions()
         cli(
            {
               version: '1.0.0',
               luminars: {
                  luminarA: String,
               },
            },
            ({ luminars }) => {
               expect<boolean | undefined>(luminars.version).toBe(true)
            },
            ['--version'],
         )
         mocked.restore()

         expect(mocked.consoleLog.called).toBe(true)
         expect(mocked.processExit.calls).toStrictEqual([[0]])
      })
   })

   describe('help', () => {
      test('disabled', () => {
         const mocked = mockEnvFunctions()
         const parsed = cli(
            {
               help: false,
            },
            (p) => {
               expect<{
                  help?: undefined
               }>(p.luminars).toEqual({})
            },
            ['--help'],
         )
         mocked.restore()

         expect<{
            help?: undefined
         }>(parsed.luminars).toEqual({})
         expect(mocked.consoleLog.called).toBe(false)
         expect(mocked.processExit.called).toBe(false)
      })

      test('enabled', () => {
         const mocked = mockEnvFunctions()
         cli(
            {
               luminars: {
                  luminarA: String,
               },
            },
            ({ luminars }) => {
               expect<boolean | undefined>(luminars.help).toBe(true)
            },
            ['--help'],
         )
         mocked.restore()

         expect(mocked.consoleLog.called).toBe(true)
         expect(mocked.processExit.calls).toStrictEqual([[0]])
      })
   })

   describe('ignoreArgv', () => {
      test('ignore after arguments', () => {
         const argv = ['--unknown', 'arg', '--help']

         let receivedArgument = false
         const parsed = cli(
            {
               ignoreArgv(type) {
                  if (receivedArgument)
                     return true

                  if (type === 'argument') {
                     receivedArgument = true
                     return true
                  }
               },
            },
            (p) => {
               expect(argv).toStrictEqual(['arg', '--help'])
               expect(p.unknownLuminars).toStrictEqual({
                  unknown: [true],
               })
            },
            argv,
         )

         expect(argv).toStrictEqual(['arg', '--help'])
         expect(parsed.unknownLuminars).toStrictEqual({
            unknown: [true],
         })
      })
   })
})
