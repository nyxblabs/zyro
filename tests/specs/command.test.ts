import { describe, expect, test } from 'vitest'
import { spy } from 'nanospy'
import { cli, command } from '../../src/index'

describe('command', () => {
   describe('error handling', () => {
      test('missing options', () => {
         expect(() => {
            // @ts-expect-error no options
            command()
         }).toThrow('Command options are required')
      })

      test('missing command name', () => {
         expect(() => {
            // @ts-expect-error no name
            command({})
         }).toThrow('Command name is required')
      })

      test('empty command name', () => {
         expect(() => {
            command({
               name: '',
            })
         }).toThrow('Invalid command name ""')
      })

      test('invalid command name', () => {
         expect(() => {
            command({
               name: 'a b c',
            })
         }).toThrow('Invalid command name "a b c". Command names must be one word.')
      })

      test('duplicate command name', () => {
         expect(() => {
            cli(
               {
                  commands: [
                     command({
                        name: 'duplicate',
                     }),
                     command({
                        name: 'duplicate',
                     }),
                  ],
               },
               undefined,
               ['commandA', '--luminarA', 'valueA'],
            )
         }).toThrow('Duplicate command name found: "duplicate"')
      })

      test('duplicate command alias', () => {
         expect(() => {
            cli(
               {
                  commands: [
                     command({
                        name: 'duplicate',
                     }),
                     command({
                        name: 'command',
                        alias: 'duplicate',
                     }),
                  ],
               },
               undefined,
               ['commandA', '--luminarA', 'valueA'],
            )
         }).toThrow('Duplicate command name found: "duplicate"')
      })
   })

   describe('command', () => {
      test('invoking command', () => {
         const callback = spy()

         const commandA = command({
            name: 'commandA',
            luminars: {
               luminarA: String,
            },
         }, (parsed) => {
            expect<string | undefined>(parsed.luminars.luminarA)
            expect<boolean | undefined>(parsed.luminars.help)
            callback()
         })

         const parsed = cli(
            {
               commands: [
                  commandA,
               ],
            },
            undefined,
            ['commandA', '--luminarA', 'valueA'],
         )

         expect(parsed.command).toBe('commandA')

         // Narrow type
         if (parsed.command === 'commandA') {
            expect<string | undefined>(parsed.luminars.luminarA).toBe('valueA')

            // @ts-expect-error non exixtent property
            expect(parsed.luminars.luminarC)
         }

         expect(callback.called).toBe(true)
      })

      test('invoking command via alias', () => {
         const callback = spy()

         const commandA = command({
            name: 'commandA',

            alias: 'a',

            luminars: {
               luminarA: String,
            },
         }, (parsed) => {
            expect<string | undefined>(parsed.luminars.luminarA)
            expect<boolean | undefined>(parsed.luminars.help)
            callback()
         })

         const parsed = cli(
            {
               commands: [
                  commandA,
               ],
            },
            undefined,
            ['a', '--luminarA', 'valueA'],
         )

         expect(parsed.command).toBe('commandA')

         // Narrow type
         if (parsed.command === 'commandA') {
            expect<string | undefined>(parsed.luminars.luminarA).toBe('valueA')

            // @ts-expect-error non exixtent property
            expect(parsed.luminars.luminarC)
         }

         expect(callback.called).toBe(true)
      })

      test('invoking command via alias array', () => {
         const callback = spy()

         const commandA = command({
            name: 'commandA',

            alias: ['a', 'b'],

            luminars: {
               luminarA: String,
            },
         }, (parsed) => {
            expect<string | undefined>(parsed.luminars.luminarA)
            expect<boolean | undefined>(parsed.luminars.help)
            callback()
         })

         const parsed = cli(
            {
               commands: [
                  commandA,
               ],
            },
            undefined,
            ['b', '--luminarA', 'valueA'],
         )

         expect(parsed.command).toBe('commandA')

         // Narrow type
         if (parsed.command === 'commandA') {
            expect<string | undefined>(parsed.luminars.luminarA).toBe('valueA')

            // @ts-expect-error non exixtent property
            expect(parsed.luminars.luminarC)
         }

         expect(callback.called).toBe(true)
      })

      test('smoke', () => {
         const callback = spy()

         const commandA = command({
            name: 'commandA',
            luminars: {
               luminarA: String,
            },
         }, (parsed) => {
            expect<string | undefined>(parsed.luminars.luminarA)
            expect<boolean | undefined>(parsed.luminars.help)
         })

         const commandB = command({
            name: 'commandB',
            version: '1.0.0',
            parameters: ['<cmd a>', '[cmd-B]'],
            luminars: {
               luminarB: {
                  type: String,
                  default: 'true',
                  description: 'luminarB description',
               },
            },
         }, (parsed) => {
            expect<string>(parsed.luminars.luminarB)
            expect<boolean | undefined>(parsed.luminars.help)
         })

         const argv = cli(
            {
               version: '1.0.0',

               parameters: ['[parsed-A]', '[valueB]'],

               luminars: {
                  luminarC: Number,
               },

               commands: [
                  commandA,
                  commandB,
               ],
            },
            (parsed) => {
               expect<boolean | undefined>(parsed.luminars.version)
               expect<boolean | undefined>(parsed.luminars.help)
               expect<number | undefined>(parsed.luminars.luminarC)
               callback()
            },
            ['--luminarA', 'valueA', '--luminarB', '123'],
         )

         if (argv.command === undefined) {
            expect<number | undefined>(argv.luminars.luminarC)
            expect<string | undefined>(argv._.parsedA)
            expect<string | undefined>(argv._.valueB)
         }

         if (argv.command === 'commandA') {
            expect<string | undefined>(argv.luminars.luminarA)

            // @ts-expect-error non exixtent property
            expect(argv.luminars.luminarC)
         }

         if (argv.command === 'commandB') {
            expect<string>(argv.luminars.luminarB)
            expect<boolean | undefined>(argv.luminars.version)
            expect<string>(argv._.cmdA)
            expect<string | undefined>(argv._.cmdB)
         }

         expect(callback.called).toBe(true)
      })
   })

   describe('ignoreArgv', () => {
      test('ignore after arguments', () => {
         const callback = spy()
         const argv = ['commandA', '--unknown', 'arg', '--help']

         let receivedArgument = false
         const commandA = command({
            name: 'commandA',
            luminars: {
               luminarA: String,
            },
            ignoreArgv(type) {
               if (receivedArgument)
                  return true

               if (type === 'argument') {
                  receivedArgument = true
                  return true
               }
            },
         }, (parsed) => {
            expect<(string | boolean)[]>(parsed.unknownLuminars.unknown).toStrictEqual([true])
            callback()
         })

         const parsed = cli(
            {
               commands: [
                  commandA,
               ],
            },
            undefined,
            argv,
         )

         expect(parsed.command).toBe('commandA')

         // Narrow type
         if (parsed.command === 'commandA')
            expect<(string | boolean)[]>(parsed.unknownLuminars.unknown).toStrictEqual([true])

         expect(callback.called).toBe(true)
      })
   })
})
