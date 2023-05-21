import tty from 'node:tty'
import type { Options as TerminalColumnsOptions } from 'tabletron'
import terminalColumns, {
   breakpoints,
} from 'tabletron'
import type { HelpDocumentNode } from '../types'
import type { LuminarData } from './render-luminars'

type TypeFunction = (value: any) => any

/**
 * process.stdout.hasColors() may not be available if stdout is not a TTY,
 * but whether the viewer can render colors is an environment concern:
 * https://github.com/nodejs/node/blob/v18.0.0/lib/internal/tty.js#L106
 *
 * In the future, they may deprecate the prototype method in favor of a
 * standalone function:
 * https://github.com/nodejs/node/pull/40240
 */
const stdoutHasColors = tty.WriteStream.prototype.hasColors()

type HelpDocumentNodeOrString<Type extends PropertyKey> = string | HelpDocumentNode<Type>
export class Renderers {
   // Useful for associating an id with data:
   // { id: 'title', type: 'string' }
   text(text: string) {
      return text
   }

   bold(text: string) {
      return stdoutHasColors
         ? `\u001B[1m${text}\u001B[22m`
         : text.toLocaleUpperCase()
   }

   indentText({ text, spaces }: { text: string; spaces: number }) {
      return text.replace(/^/gm, ' '.repeat(spaces))
   }

   heading(text: string) {
      return this.bold(text)
   }

   section({
      title,
      body,
      indentBody = 2,
   }: {
      title?: string
      body?: string
      indentBody?: number
   }) {
      return (
         `${
            (
               title
                  ? `${this.heading(title)}\n`
                  : ''
            )
            + (
               body
                  ? this.indentText({
                     text: this.render(body),
                     spaces: indentBody,
                  })
                  : ''
            )
         }\n`
      )
   }

   table({
      tableData,
      tableOptions,
      tableBreakpoints,
   }: {
      tableData: string[][]
      tableOptions?: TerminalColumnsOptions
      tableBreakpoints?: Record<string, TerminalColumnsOptions>
   }) {
      return terminalColumns(
         tableData.map(row => row.map(cell => this.render(cell))),
         tableBreakpoints ? breakpoints(tableBreakpoints) : tableOptions,
      )
   }

   luminarParameter(
      typeFunction: TypeFunction | readonly [TypeFunction],
   ): string {
      if (typeFunction === Boolean)
         return ''

      if (typeFunction === String)
         return '<string>'

      if (typeFunction === Number)
         return '<number>'

      if (Array.isArray(typeFunction))
         return this.luminarParameter(typeFunction[0])

      return '<value>'
   }

   luminarOperator(_: LuminarData) {
      return ' '
   }

   luminarName(luminarData: LuminarData) {
      const {
         luminar,
         luminarFormatted,
         aliasesEnabled,
         aliasFormatted,
      } = luminarData
      let luminarText = ''

      if (aliasFormatted)
         luminarText += `${aliasFormatted}, `

      else if (aliasesEnabled)
         luminarText += '    '

      luminarText += luminarFormatted

      if ('placeholder' in luminar && typeof luminar.placeholder === 'string') {
         luminarText += `${this.luminarOperator(luminarData)}${luminar.placeholder}`
      }
      else {
         // Test: default luminar for String type short-hand
         const luminarPlaceholder = this.luminarParameter('type' in luminar ? luminar.type : luminar)
         if (luminarPlaceholder)
            luminarText += `${this.luminarOperator(luminarData)}${luminarPlaceholder}`
      }

      return luminarText
   }

   luminarDefault(value: any) {
      return JSON.stringify(value)
   }

   luminarDescription({ luminar }: LuminarData) {
      let descriptionText = 'description' in luminar ? (luminar.description ?? '') : ''

      if ('default' in luminar) {
         let { default: luminarDefault } = luminar

         if (typeof luminarDefault === 'function')
            luminarDefault = luminarDefault()

         if (luminarDefault)
            descriptionText += ` (default: ${this.luminarDefault(luminarDefault)})`
      }

      return descriptionText
   }

   render(
      nodes: (
         HelpDocumentNodeOrString<keyof this>
         | HelpDocumentNodeOrString<keyof this>[]
      ),
   ): string {
      if (typeof nodes === 'string')
         return nodes

      if (Array.isArray(nodes))
         return nodes.map(node => this.render(node)).join('\n')

      if ('type' in nodes && this[nodes.type]) {
         const renderer = this[nodes.type]
         if (typeof renderer === 'function')
            return renderer.call(this, nodes.data)
      }

      throw new Error(`Invalid node type: ${JSON.stringify(nodes)}`)
   }
}
