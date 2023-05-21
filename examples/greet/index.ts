/**
 * Demo from README.md
 *
 * Usage:
 *  npx esno examples/greet --help
 */
import consolji from 'consolji'
import { cli } from '../../src'

// Parse argv
const argv = cli({
   name: 'greet.js',

   // Define parameters
   // Becomes available in ._.filePath
   parameters: [
      '<first name>', // First name is required
      '[last name]', // Last name is optional
   ],

   // Define luminars/options
   // Becomes available in .luminars
   luminars: {
      // Parses `--time` as a string
      time: {
         type: String,
         description: 'Time of day to greet (morning or evening)',
         default: 'morning',
      },
   },
})

const name = [argv._.firstName, argv._.lastName].filter(Boolean).join(' ')

if (argv.luminars.time === 'morning')
   consolji.log(`Good morning ${name}!`)

else
   consolji.log(`Good evening ${name}!`)
