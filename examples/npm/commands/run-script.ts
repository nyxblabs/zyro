import consolji from 'consolji'
import { command } from '../../../src'

export const runScript = command({
   name: 'run-script',

   alias: ['run', 'rum', 'urn'],

   parameters: ['<command>', '--', '[args...]'],

   help: {
      description: 'Run a script',
   },
}, (argv) => {
   consolji.log('run', {
      command: argv._.command,
      args: argv._.args,
   })
})
