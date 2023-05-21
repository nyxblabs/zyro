import { expectType } from 'tsd'
import { cli, command } from '../src/index'

type Arguments = string[] & { '--': string[] }

const parsed = cli({
   parameters: ['[foo]', '<bar...>'],

   luminars: {
      booleanLuminar: Boolean,
      booleanLuminarDefault: {
         type: Boolean,
         default: false,
      },
      stringLuminar: String,
      stringLuminarDefault: {
         type: String,
         default: 'hello',
      },
      numberLuminar: Number,
      numberLuminarDefault: {
         type: Number,
         default: 1,
      },
      extraOptions: {
         type: Boolean,
         alias: 'e',
         default: false,
         description: 'Some description',
      },
   },

   commands: [
      command({
         name: 'commandA',

         parameters: ['[bar]', '<foo...>', '<hello world>', '<hello-world>', '<hello_world>', '<hello.world>', '<hello =world>', '<hello / world>'],

         luminars: {
            booleanLuminar: Boolean,
            booleanLuminarDefault: {
               type: Boolean,
               default: false,
            },
            stringLuminar: String,
            stringLuminarDefault: {
               type: String,
               default: 'hello',
            },
            numberLuminar: Number,
            numberLuminarDefault: {
               type: Number,
               default: 1,
            },
            extraOptions: {
               type: Boolean,
               alias: 'e',
               default: false,
               description: 'Some description',
            },
         },
      }, ({ luminars }) => {
         expectType<{
            booleanLuminar: boolean | undefined
            booleanLuminarDefault: boolean
            stringLuminar: string | undefined
            stringLuminarDefault: string
            numberLuminar: number | undefined
            numberLuminarDefault: number
            extraOptions: boolean
            help: boolean | undefined
         }>(luminars)
      }),
   ],
}, ({ luminars }) => {
   expectType<{
      booleanLuminar: boolean | undefined
      booleanLuminarDefault: boolean
      stringLuminar: string | undefined
      stringLuminarDefault: string
      numberLuminar: number | undefined
      numberLuminarDefault: number
      extraOptions: boolean
      help: boolean | undefined
   }>(luminars)
})

if (parsed.command === undefined) {
   expectType<
      Arguments & {
         foo: string | undefined
         bar: string[]
      }
   >(parsed._)

   expectType<{
      booleanLuminar: boolean | undefined
      booleanLuminarDefault: boolean
      stringLuminar: string | undefined
      stringLuminarDefault: string
      numberLuminar: number | undefined
      numberLuminarDefault: number
      extraOptions: boolean
      help: boolean | undefined
   }>(parsed.luminars)
}

if (parsed.command === 'commandA') {
   expectType<
      Arguments & {
         bar: string | undefined
         foo: string[]
         helloWorld: string
      }
   >(parsed._)

   expectType<{
      booleanLuminar: boolean | undefined
      booleanLuminarDefault: boolean
      stringLuminar: string | undefined
      stringLuminarDefault: string
      numberLuminar: number | undefined
      numberLuminarDefault: number
      extraOptions: boolean
      help: boolean | undefined
   }>(parsed.luminars)
}
