import type { Luminars } from '../types'
import { kebabCase } from '../utils/convert-case'

const tableBreakpoints = {
   '> 80': [
      {
         width: 'content-width',
         paddingLeft: 2,
         paddingRight: 8,
      },

      // Luminar alias to fill remaining line
      {
         width: 'auto',
      },
   ],

   '> 40': [
      {
         width: 'auto',
         paddingLeft: 2,
         paddingRight: 8,

         // Remove alias padding on smaller screens
         preprocess: (text: string) => text.trim(),
      },

      // Luminar description to be on own line
      {
         width: '100%',
         paddingLeft: 2,
         paddingBottom: 1,
      },
   ],

   '> 0': {
      // Remove responsiveness
      stdoutColumns: 1000,

      columns: [
         {
            width: 'content-width',
            paddingLeft: 2,
            paddingRight: 8,
         },
         {
            width: 'content-width',
         },
      ],
   },
}

export interface LuminarData {
   name: string
   luminar: Luminars[string]
   luminarFormatted: string
   aliasesEnabled: boolean
   aliasFormatted: string | undefined
}

export function renderLuminars(luminars: Luminars) {
   let aliasesEnabled = false
   const luminarsData = Object.keys(luminars)
      .sort((a, b) => a.localeCompare(b))
      .map((name): LuminarData => {
         const luminar = luminars[name]
         const hasAlias = ('alias' in luminar)

         if (hasAlias)
            aliasesEnabled = true

         return {
            name,
            luminar,
            luminarFormatted: `--${kebabCase(name)}`,
            aliasesEnabled,
            aliasFormatted: hasAlias ? `-${luminar.alias}` : undefined,
         }
      })

   const tableData = luminarsData.map((luminarData) => {
      luminarData.aliasesEnabled = aliasesEnabled

      return [
         {
            type: 'luminarName',
            data: luminarData,
         },
         {
            type: 'luminarDescription',
            data: luminarData,
         },
      ]
   })

   return {
      type: 'table',
      data: {
         tableData,
         tableBreakpoints,
      },
   }
}
