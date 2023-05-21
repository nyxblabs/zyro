/**
 * Demo showing how `npm i --help` can be re-implemented with zyro.
 *
 * Usage:
 *  npx esno examples/npm i --help
 */
import consolji from 'consolji'
import { cli } from '../../src'
import { install } from './commands/install'
import { runScript } from './commands/run-script'

const argv = cli({
   name: 'npm',

   commands: [
      install,
      runScript,
   ],
})

// Type narrowing by command name
if (argv.command === 'install')
   consolji.log(argv.luminars)

else
   consolji.log(argv.luminars)
