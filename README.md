[![cover][cover-src]][cover-href]
[![npm version][npm-version-src]][npm-version-href] 
[![npm downloads][npm-downloads-src]][npm-downloads-href] 
[![bundle][bundle-src]][bundle-href] [![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

> 🚀 Unleash the power of command-line with our intuitive CLI development tool - your gateway to automation! 🛠️🎉

### Features
- Minimal API surface
- Powerful flag (luminar) parsing
- Strongly typed parameters and flags (luminars)
- Command support
- Help documentation generation (customizable too!)

➡️ [Try it out online](https://stackblitz.com/edit/zyro-demo?devtoolsheight=50&file=examples/greet.ts&view=editor)

#### Support this project by starring and sharing it. [Follow me](https://github.com/privatenumber) to see what other cool projects I'm working on.

## 📥 Install: 

```bash
# nyxi
nyxi zyro

# pnpm
pnpm add zyro

# npm
npm i zyro

# yarn
yarn add zyro
```

## ℹ️ About

_zyro_ makes it very easy to develop command-line scripts in Node.js. It handles argv parsing to give you strongly typed parameters + flags (luminars) and generates `--help` documentation based on the provided information.

Here's an example script that simply logs: `Good morning/evening <name>!`:

_greet.js:_
```ts
import { cli } from 'zyro'

// Parse argv
const argv = cli({
   name: 'greet.js',

   // Define parameters
   parameters: [
      '<first name>', // First name is required
      '[last name]' // Last name is optional
   ],

   // Define luminars/options
   luminars: {

      // Parses `--time` as a string
      time: {
         type: String,
         description: 'Time of day to greet (morning or evening)',
         default: 'morning'
      }
   }
})

const name = [argv._.firstName, argv._.lastName].filter(Boolean).join(' ')

if (argv.luminars.time === 'morning')
   console.log(`Good morning ${name}!`)

else
   console.log(`Good evening ${name}!`)
```

🛠 In development, type hints are provided on parsed flags (luminars) and parameters:
<p align="center">
    <br>
    <img src=".github/luminar.png" width="600">
    <br>
    <i>Type hints for Zyro's output are very verbose and readable</i>
    <br>
    <br>
</p>

📖 Generated help documentation can be viewed with the `--help` flag (luminar):

```sh
$ node greet.js --help

greet.js

Usage:
  greet.js [luminars...] <first name> [last name]

Luminars:
  -h, --help                 Show help
      --time <string>        Time of day to greet (morning or evening) (default: "morning")
```

🏃 Run the script to see it in action:

```sh
$ node greet.js John Doe --time evening

Good evening John Doe!
```

## 🔥 Examples

Want to dive right into some code? Check out some of these examples:

- ✨ **greet.js**: Working example from above
- 📦 **npm install**: Reimplementation of [`npm install`](https://docs.npmjs.com/cli/install/)'s CLI
- 🚀 **tsc**: Reimplementation of TypeScript [`tsc`](https://www.typescriptlang.org/docs/handbook/compiler-options.html)'s CLI
- 🐦 **snap-tweet**: Reimplementation of [`snap-tweet`](https://github.com/privatenumber/snap-tweet)'s CLI
- 📏 **pkg-size**: Reimplementation of [`pkg-size`](https://github.com/pkg-size/pkg-size)'s CLI

## 📚 Usage

### 🛠️ Arguments

Arguments are values passed into the script that are not associated with any luminars/options.

For example, in the following command, the first argument is `file-a.txt` and the second is `file-b.txt`:

```
$ my-script file-a.txt file-b.txt
```

Arguments can be accessed from the `_` array-property of the returned object.

Example:

```ts
const argv = cli({ /* ... */ })

// $ my-script file-a.txt file-b.txt

argv._ // => ["file-a.txt", "file-b.txt"] (string[])
```

#### 🧩 Parameters

Parameters (aka _positional arguments_) are the names that map against argument values. Think of parameters as variable names and arguments as values associated with the variables.

Parameters can be defined in the `parameters` array-property to make specific arguments accessible by name. This is useful for writing more readable code, enforcing validation, and generating help documentation.

Parameters are defined in the following formats:
-  🌟 **Required parameters** are indicated by angle brackets (e.g., `<parameter name>`).
- 🌈 **Optional parameters** are indicated by square brackets (e.g., `[parameter name]`).
- 🚀 **Spread parameters** are indicated by the `...` suffix (e.g., `<parameter name...>` or `[parameter name...]`).

Note, required parameters cannot come after optional parameters, and spread parameters must be last.

Parameters can be accessed in camelCase on the `_` property of the returned object.

🌟 Example:

```ts
const argv = cli({
   parameters: [
      '<required parameter>',
      '[optional parameter]',
      '[optional spread...]'
   ]
})

// $ my-script a b c d

argv._.requiredParameter // => "a" (string)
argv._.optionalParameter // => "b" (string | undefined)
argv._.optionalSpread // => ["c", "d"] (string[])
```

🏁 End-of-flags (luminars)

End-of-flags (luminars) (`--`) (aka _end-of-options_) allows users to pass in a subset of arguments. This is useful for passing in arguments that should be parsed separately from the rest of the arguments or passing in arguments that look like flags (luminars).

An example of this is [`npm run`](https://docs.npmjs.com/cli/v8/commands/npm-run-script):
```sh
$ npm run <script> -- <script arguments>
```
The `--` indicates that all arguments afterwards should be passed into the _script_ rather than _npm_.

All end-of-luminar arguments will be accessible from `argv._['--']`.

Additionally, you can specify `--` in the `parameters` array to parse end-of-luminars arguments.

Example:

```ts
const argv = cli({
   name: 'npm-run',
   parameters: [
      '<script>',
      '--',
      '[arguments...]'
   ]
})

// $ npm-run echo -- hello world

argv._.script // => "echo" (string)
argv._.arguments // => ["hello", "world] (string[])
```


🚩 Flags (Luminars)

Flags (Luminars) (aka Options) are key-value pairs passed into the script in the format `--luminar-name <value>`.

For example, in the following command, `--file-a` has value `data.json` and `--file-b` has value `file.txt`:

```
$ my-script --file-a data.json --file-b=file.txt
```

#### 🔍 Parsing features
_Zyro_'s flag (luminar) parsing is powered by [`luminar`](https://github.com/nyxblabs/luminar) and comes with many features:

- 🔢 Array & Custom types
- 🚩 Flag (Luminar) delimiters: `--luminar value`, `--luminar=value`, `--luminar:value`, and `--luminar.value`
- 🔄 Combined aliases: `-abcd 2` → `-a -b -c -d 2`
- ⏹️ [End of flags (luminars)](https://unix.stackexchange.com/a/11382): Pass in `--` to end flag (luminar) parsing
- ❓ Unknown flags (luminars): Unexpected flags (luminars) stored in `unknownLuminars`


Read the [_luminar_ docs](https://github.com/nyxblabs/luminar) to learn more.

#### 🚩 Defining flags (luminars)

Flags (Luminars) can be specified in the `luminar` object-property, where the key is the luminar name, and the value is a flag (luminar) type function or an object that describes the luminar.

The flag (luminar) name is recommended to be in camelCase as it will be interpreted to parse kebab-case equivalents.

The flag (luminar) type function can be any function that accepts a string and returns the parsed value. Default JavaScript constructors should cover most use-cases: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/String), [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/Number), [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean/Boolean), etc.

The flag (luminar) description object can be used to store additional information about the flag (luminar), such as `alias`, `default`, and `description`. To accept multiple values for a flag (luminar), wrap the type function in an array.

All of the provided information will be used to generate better help documentation.

🌟 Example:

```ts
const argv = cli({
   luminars: {
      someBoolean: Boolean,

      someString: {
         type: String,
         description: 'Some string flag (luminar)',
         default: 'n/a'
      },

      someNumber: {
         // Wrap the type function in an array to allow multiple values
         type: [Number],
         alias: 'n',
         description: 'Array of numbers. (eg. -n 1 -n 2 -n 3)'
      }
   }
})

// $ my-script --some-boolean --some-string hello --some-number 1 -n 2

argv.luminars.someBoolean // => true (boolean | undefined)
argv.luminars.someString // => "hello" (string)
argv.luminars.someNumber // => [1, 2] (number[])
```

#### 🚩 Custom flag (luminar) types & validation

Custom flag (luminar) types can be created to validate flags (luminars) and narrow types. Simply create a new function that accepts a string and returns the parsed value.

Here's an example with a custom `Size` type that narrows the flag (luminar) type to `"small" | "medium" | "large"`:

```ts
const possibleSizes = ['small', 'medium', 'large'] as const

type Sizes = typeof possibleSizes[number] // => "small" | "medium" | "large"

// Custom type function
function Size(size: Sizes) {
   if (!possibleSizes.includes(size))
      throw new Error(`Invalid size: "${size}"`)

   return size
}

const argv = cli({
   luminars: {
      size: {
         type: Size,
         description: 'Size of the pizza (small, medium, large)'
      }
   }
})

// $ my-script --size large

argv.luminars.size // => "large" ("small" | "medium" | "large")
```

🏁 Default flags (luminars)

By default, _Zyro_ will try to handle the `--help, -h` and `--version` flags (luminars).

##### ℹ️ Help flag (luminar)

Handling `--help, -h` is enabled by default.

To disable it, set `help` to `false`. The help documentation can still be manually displayed by calling `.showHelp(helpOptions)` on the returned object.

##### 📋 Version flag (luminar)

To enable handling `--version`, specify the `version` property.

```ts
cli({
   version: '1.2.3'
})
```

```sh
$ my-script --version
1.2.3
```

The version is also shown in the help documentation. To opt out of handling `--version` while still showing the version in `--help`, pass the version into `help.version`.

### 💡 Commands
Commands allow organizing multiple "scripts" into a single script. An example of this is the [`npm install`](https://docs.npmjs.com/cli/install/) command, which is essentially an "install" script inside the "npm" script, adjacent to other commands like [`npm run`](https://docs.npmjs.com/cli/run-script/).

#### 💡 Defining commands
A command can be created by importing the `command` function and initializing it with a name. The rest of the options are the same as the `cli` function.

Pass the created command into `cli` option's `commands` array-property to register it:

_npm.js_
```ts
import { cli, command } from 'zyro'

const argv = cli({
   name: 'npm',

   version: '1.2.3',

   commands: [
      command({
         // Command name
         name: 'install',

         parameters: ['<package name>'],

         luminars: {
            noSave: Boolean,
            saveDev: Boolean
         }
      })
   ]
})

// $ npm install lodash

argv.command // => "install" (string)
argv._.packageName // => "lodash" (string)
```

Depending on the command given, the resulting type can be narrowed:
<p align="center">
    <img src=".github/command-type-narrowing.png" width="420">
</p>

#### 🔧 Command callback

When a CLI app has many commands, it's recommended to organize each command in its own file. With this structure, parsed output handling for each command is better placed where they are respectively defined rather than the single `cli` output point. This can be done by passing a callback function into the `command` function (callbacks are supported in the `cli` function too).

💡 Example:

_install-command.js_ (`install` command using callback)
```ts
import { command } from 'zyro'

export const installCommand = command({
   // Command name
   name: 'install',

   parameters: ['<package name>'],

   luminars: {
      noSave: Boolean,
      saveDev: Boolean
   }
}, (argv) => {
   // $ npm install lodash

   argv._.packageName // => "lodash" (string)
})
```

_npm.js_ (CLI entry file)
```ts
import { installCommand } from './install-command.js'

cli({
   name: 'npm',

   commands: [
      installCommand
   ]
})
```

### 📚 Help documentation
_Zyro_ uses all information provided to generate rich help documentation. The more information you give, the better the docs!

#### 🎨 Help customization
The help document can be customized by passing a `render(nodes, renderers) => string` function to `help.render`.

The `nodes` parameter contains an array of nodes that will be used to render the document. The `renderers` parameter is an object of functions used to render the document. Each node has properties `type` and `data`, where `type` corresponds to a property in `renderers` and `data` is passed into the render function.

Default renderers can be found in [`/src/render-help/renderers.ts`](/src/render-help/renderers.ts).

Here's an example that adds an extra sentence at the end and also updates the flags (luminars) table to use the `=` operator (`--luminar <value>` → `--luminar=<value>`):

```ts
cli({
   // ...,

   help: {
      render(nodes, renderers) {
         /* Modify nodes... */

         // Add some text at end of document
         nodes.push('\nCheckout Zyro: https://github.com/nyxblabs/zyro')

         /* Extend renderers... */

         // Make all iluminar examples use `=` as the separator
         renderers.iluminarOperator = () => '='

         /* Render nodes and return help */
         return renderers.render(nodes)
      }
   }
})
```

#### 📊 Responsive tables
_Zyro_'s "Luminars" table in the help document is responsive and wraps cell text content based on the column & terminal width. It also has [breakpoints to display more vertically-optimized tables](/src/render-help/render-luminars.ts#L4) for narrower viewports.

This feature is powered by [tabletron](https://github.com/nyxblabs/tabletron) and can be configured via the `renderers.table` renderer.

<table>
	<tr>
		<th>Normal width</th>
		<th>Narrow width</th>
	</tr>
	<tr>
		<th><img src=".github/responsive-normal.png" width="420"></th>
		<th><img src=".github/responsive-narrow.png" width="300"></th>
	</tr>
</table>

## 📚 API

### 🚀 `cli(options, callback?, argvs?)`

Return type:
```ts
interface ParsedArgv {
   // Parsed arguments
   _: string[] & Parameters

   // Parsed luminars
   luminars: {
      [luminarName: string]: InferredType
   }

   // Unexpected luminars
   unknownLuminars: {
      [luminarName: string]: (string | boolean)[]
   }

   // Method to print version
   showVersion: () => void

   // Method to print help
   showHelp: (options: HelpOptions) => void
}
```

Function to parse argvs by declaring parameters and flags (luminars).

#### 🛠️ options

Options object to configure `cli`.

##### 📝 name

Type: `string`

Name of the script used in the help documentation.

##### 📝 version

Type: `string`

Version of the script used in the help documentation.

Passing this in enables auto-handling `--version`. To provide a version for the documentation without auto-handling `--version`, pass it into [`help.version`](#version-1).

##### 📝 parameters

Type: `string[]`

Parameter names to map onto arguments. Also used for validation and help documentation.

Parameters must be defined in the following formats:
| Format | Description |
| - | - |
| `<parameter name>` | Required parameter |
| `[parameter name]` | Optional parameter |
| `<parameter name...>` | Required spread parameter (1 or more) |
| `[parameter name...]` | Optional spread parameter (0 or more) |

Required parameters must be defined before optional parameters, and spread parameters must be defined at the end.

##### 🚩 flags (luminars)

Type: An object that maps the flag (luminar) name (in camelCase) to a flag (luminar) type function or an object describing the flag (luminar):

| Property | Type | Description |
| - | - | - |
| `type` | `Function` | Luminar value parsing function. |
| `alias` | `string` | Single character alias for the luminar. |
| `default` | `any` | Default value for the luminar. |
| `description` | `string` | Description of the luminar shown in `--help`. |
| `placeholder` | `string` | Placeholder for the luminar value shown in `--help`. |

##### ℹ️ help

Type: `false` or an object with the following properties.

| Property | Type | Description |
| - | - | - |
| `version` | `string` | Version shown in `--help`. |
| `description` | `string` | Description shown in `--help`. |
| `usage` | `string \| string[]` | Usage code examples shown in `--help`. |
| `examples` | `string \| string[]` | Example code snippets shown in `--help`. |
| `render` | `(nodes, renderers) => string` | Function to customize the help document. |

Handling `--help, -h` is enabled by default. To disable it, pass in `false`.

##### 📋 commands

Type: `Command[]`

Array of [commands](#commandoptions-callback) to register.

##### ignoreArgv

Type:
```ts
type IgnoreArgvCallback = (
   type: 'known-luminar' | 'unknown-luminar' | 'argument',
   luminarOrArgv: string,
   value: string | undefined,
) => boolean | void
```

A callback to ignore argv tokens from being parsed.

#### ⚙️ callback(parsed)

Type: 

Optional callback function that is called when the script is invoked without a command.

#### 📋 argvs

Type: `string[]`

Default: `process.argv.slice(2)`

The raw parameters array to parse.

### ⚙️ command(options, callback?)

#### ⚙️ options

| Property | Type | Description |
| - | - | - |
| `name` | `string` | Required name used to invoke the command. |
| `alias` | `string \| string[]` | Aliases used to invoke the command. |
| `parameters` | `string[]` | Parameters for the command. Same as [`parameters`](#parameters-1). |
| `luminars` | `Luminars` | Luminars for the command. Same as [`luminars`](#luminars-1). |
| `help` | `false \| HelpOptions` | Help options for the command. Same as [`help`](#help-1). |

#### ⚡️callback(parsed)

Type: 

Optional callback function that is called when the command is invoked.

## 📜 License

[MIT](./LICENSE) - Made with 💞

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/zyro?style=flat&colorA=18181B&colorB=14F195
[npm-version-href]: https://npmjs.com/package/zyro
[npm-downloads-src]: https://img.shields.io/npm/dm/zyro?style=flat&colorA=18181B&colorB=14F195
[npm-downloads-href]: https://npmjs.com/package/zyro
[bundle-src]: https://img.shields.io/bundlephobia/minzip/zyro?style=flat&colorA=18181B&colorB=14F195
[bundle-href]: https://bundlephobia.com/result?p=zyro
[jsdocs-src]: https://img.shields.io/badge/jsDocs.io-reference-18181B?style=flat&colorA=18181B&colorB=14F195
[jsdocs-href]: https://www.jsdocs.io/package/zyro
[license-src]: https://img.shields.io/github/license/nyxblabs/zyro.svg?style=flat&colorA=18181B&colorB=14F195
[license-href]: https://github.com/nyxblabs/zyro/blob/main/LICENSE

<!-- Cover -->
[cover-src]: https://raw.githubusercontent.com/nyxblabs/zyro/main/.github/assets/cover-github-zyro.png
[cover-href]: https://💻nyxb.ws
