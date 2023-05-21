import type {
   Luminars as BaseLuminars,
   TypeLuminar,
   TypeLuminarOptions,
} from 'luminar'
import type { Command } from './command'
import type { Renderers } from './render-help/renderers'

export declare const parsedType: unique symbol

export type Luminars = BaseLuminars<{

   /**
   Description to be used in help output

   @example
   ```
   description: 'Unit of output (metric, imperial)',
   ```
   */
   description?: string

   /**
   Placeholder label to be used in help output

   @example Required value
   ```
   placeholder: '<locale>'
   ```
   */
   placeholder?: string
}>

export type CallbackFunction<Parsed> = (parsed: {
   // This exposes the content of "TypeLuminar<T>" in type hints
   [Key in keyof Parsed]: Parsed[Key];
}) => void

type HasVersion<Options extends { luminars?: Luminars }> = (
   Options extends { version: string }
      ? Options['luminars'] & { version: BooleanConstructor }
      : Options['luminars']
)

type HasHelp<Options extends { luminars?: Luminars }> = (
   Options extends { help: false }
      ? Options['luminars']
      : Options['luminars'] & { help: BooleanConstructor }
)

export type HasHelpOrVersion<Options extends { luminars?: Luminars }> = (
   HasVersion<Options> & HasHelp<Options>
)

export interface HelpDocumentNode<Types extends PropertyKey = keyof Renderers> {
   id?: string
   type: Types
   data: any
}

export interface HelpOptions {

   /**
   Version of the script displayed in `--help` output. Use to avoid enabling `--version` luminar.
   */
   version?: string

   /**
   Description of the script or command to display in `--help` output.
   */
   description?: string

   /**
   Usage code examples to display in `--help` output.
   */
   usage?: false | string | string[]

   /**
   Example code snippets to display in `--help` output.
   */
   examples?: string | string[]

   /**
   Function to customize the help document before it is logged.
   */
   render?: (
      nodes: HelpDocumentNode<keyof Renderers>[],
      renderers: Renderers,
   ) => string
}

export interface CliOptions<
   Commands = Command[], Parameters extends string[] = string[],
> {
   /**
   Name of the script displayed in `--help` output.
   */
   name?: string

   /**
   Version of the script displayed in `--version` and `--help` outputs.
   */
   version?: string

   /**
   Parameters accepted by the script. Parameters must be in the following formats:

   - Required parameter: `<parameter name>`
   - Optional parameter: `[parameter name]`
   - Required spread parameter: `<parameter name...>`
   - Optional spread parameter: `[parameter name...]`
   */
   parameters?: Parameters

   /**
   Commands to register to the script.
   */
   commands?: Commands

   /**
   Luminars accepted by the script
   */
   luminars?: Luminars

   /**
   Options to configure the help documentation. Pass in `false` to disable handling `--help, -h`.
   */
   help?: false | HelpOptions

   /**
    * Which argv elements to ignore from parsing
    */
   ignoreArgv?: TypeLuminarOptions['ignore']
}

export type CliOptionsInternal<
   Commands = Command[],
> = CliOptions<Commands> & {
   parent?: CliOptions
}

type AlphabetLowercase = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z'
type Numeric = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
type AlphaNumeric = AlphabetLowercase | Uppercase<AlphabetLowercase> | Numeric

type CamelCase<Word extends string> = (
  Word extends `${infer FirstCharacter}${infer Rest}`
     ? (
           FirstCharacter extends AlphaNumeric
              ? `${FirstCharacter}${CamelCase<Rest>}`
              : Capitalize<CamelCase<Rest>>
        )
     : Word
)

type StripBrackets<Parameter extends string> = (
   Parameter extends `<${infer ParameterName}>` | `[${infer ParameterName}]`
      ? (
            ParameterName extends `${infer SpreadName}...`
               ? SpreadName
               : ParameterName
         )
      : never
)

type ParameterType<Parameter extends string> = (
   Parameter extends `<${infer _ParameterName}...>` | `[${infer _ParameterName}...]`
      ? string[]
      : Parameter extends `<${infer _ParameterName}>`
         ? string
         : Parameter extends `[${infer _ParameterName}]`
            ? string | undefined
            : never
)

type WithCommand<
   Options extends { luminars?: Luminars }, Command extends string | undefined = undefined,
> = {
   command: Command
} & Options

type TypeLuminarWrapper<
   Options extends { luminars?: Luminars }, Parameters extends string[],
> = TypeLuminar<HasHelpOrVersion<Options>> & {
   _: {
      [
      Parameter in Parameters[number]
      as CamelCase<StripBrackets<Parameter>>
      ]: ParameterType<Parameter>;
   }
   showHelp: (options?: HelpOptions) => void
   showVersion: () => void
}

export type ParseArgv<
   Options extends { luminars?: Luminars }, Parameters extends string[], Command extends string | undefined = '',
> = (
   Command extends ''
      ? TypeLuminarWrapper<Options, Parameters>
      : WithCommand<TypeLuminarWrapper<Options, Parameters>, Command>
)
