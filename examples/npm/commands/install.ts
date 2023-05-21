import consolji from 'consolji'
import { command } from '../../../src'

export const install = command({
   name: 'install',

   alias: ['i', 'isntall', 'add'],

   luminars: {
      global: {
         type: Boolean,
         alias: 'g',
      },
      saveProd: String,
      saveDev: {
         type: Boolean,
         alias: 'D',
      },
      saveOptional: Boolean,
      saveExact: Boolean,
      noSave: Boolean,
   },

   help: {
      description: 'Install a package',

      examples: [
         'pnpm install (with no args, in package dir)',
         'pnpm install [<@scope>/]<pkg>',
         'pnpm install [<@scope>/]<pkg>@<tag>',
         'pnpm install [<@scope>/]<pkg>@<version>',
         'pnpm install [<@scope>/]<pkg>@<version range>',
         'pnpm install <alias>@pnpm:<name>',
         'pnpm install <folder>',
         'pnpm install <tarball file>',
         'pnpm install <tarball url>',
         'pnpm install <git:// url>',
         'pnpm install <github username>/<github project>',
      ],
   },
}, (argv) => {
   consolji.log('install!', argv)
})
