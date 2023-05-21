# Changelog


## v0.0.2


### 🚀 Enhancements

  - **arguments.test.ts): add tests for argument parsing and error handling ✨ feat(zyro.test-d.ts:** Add type definitions for argument parsing The added tests ensure that the argument parsing and error handling work as expected. The tests cover various scenarios such as invalid parameter formats, duplicate parameters, missing parameters, and spread parameters. The added type definitions ensure that the argument parsing returns the expected types. ([e04a4fa](https://github.com/nyxblabs/zyro/commit/e04a4fa))
  - **cli.test.ts): add tests for cli error handling and options validation ✨ feat(command.test.ts:** Add tests for command error handling and options validation The tests added to `cli.test.ts` cover the error handling and options validation for the `cli` function. The tests added to `command.test.ts` cover the error handling and options validation for the `command` function. These tests ensure that the functions throw the correct errors when required options are missing or invalid, and that the functions correctly parse and handle command line arguments. ([e75f3d2](https://github.com/nyxblabs/zyro/commit/e75f3d2))
  - **luminar.test.ts:** Add tests for luminars and cli options This commit adds tests for luminars and cli options. The tests cover the return type and callback of luminars, version and help options, and the ignoreArgv option. The tests ensure that the luminars are parsed correctly and that the cli options behave as expected. ([5fe82ca](https://github.com/nyxblabs/zyro/commit/5fe82ca))
  - **help.test.ts:** Add tests for help function This commit adds tests for help function. The tests cover the return type and callback of help, flags and help options. ([175c849](https://github.com/nyxblabs/zyro/commit/175c849))
  - Add new examples for esbuild, greet, npm install, and npm run-script Added new examples for esbuild, greet, npm install, and npm run-script. The examples are intended to demonstrate how to use the respective commands. ([5323c75](https://github.com/nyxblabs/zyro/commit/5323c75))

### 🩹 Fixes

  - **is-script-name.ts:** Remove unnecessary semicolon The commit removes an unnecessary semicolon from the end of the line. ([607832d](https://github.com/nyxblabs/zyro/commit/607832d))

### 🏡 Chore

  - **package.json): add linting and release scripts ✨ feat(package.json:** Add linting and release scripts to improve code quality and streamline release process The linting script runs eslint on all .ts and .js files in the project, while the lint:fix script runs eslint with the --fix flag to automatically fix any linting errors. The release script runs tests, builds the project, generates a changelog, publishes the package to the registry, and pushes the changes to the git repository with tags. These scripts improve code quality and streamline the release process. ([f628b53](https://github.com/nyxblabs/zyro/commit/f628b53))
  - **package.json): update luminar dependency to version 0.0.5 ✨ feat(cli.ts): add support for commands and command options ✨ feat(command.ts): add command function to create commands with options and parameters ✨ feat(index.ts:** Export cli, command, and Renderers The luminar dependency has been updated to version 0.0.5. The cli.ts file now supports commands and command options. The command.ts file has been added to create commands with options and parameters. The index.ts file now exports cli, command, and Renderers. ([7ead647](https://github.com/nyxblabs/zyro/commit/7ead647))
  - **package.json): reorder dependencies alphabetically and add new dependencies ✨ feat(index.ts): export all modules from the package ✨ feat(render-help): export all modules from the package 🔧 chore(convert-case.ts): remove trailing semicolons ✅ test(mock-env-functions.ts:** Add new test file to mock environment functions The package.json file has been updated to reorder dependencies alphabetically and add new dependencies. The index.ts and render-help modules have been updated to export all modules from the package. The convert-case.ts file has been updated to remove trailing semicolons. A new test file, mock-env-functions.ts, has been added to mock environment functions. ([9ced07d](https://github.com/nyxblabs/zyro/commit/9ced07d))
  - **.github:** Add cover image for GitHub repository A new cover image has been added to the .github directory. This image will be displayed as the cover image for the GitHub repository. ([66fc9da](https://github.com/nyxblabs/zyro/commit/66fc9da))
  - **package.json): remove dev script ✨ feat(package.json:** Add dynot package to support dynamic reloading of tests The dev script has been removed as it was not being used. The dynot package has been added to support dynamic reloading of tests. This allows for faster development as tests can be automatically re-run when changes are made to the codebase. ([b47900b](https://github.com/nyxblabs/zyro/commit/b47900b))
  - **package.json:** Remove unnecessary git push command from release script The git push command was removed from the release script as it is not necessary to push the changes to the repository after publishing the package. ([381ed12](https://github.com/nyxblabs/zyro/commit/381ed12))

### 🎨 Styles

  - **github-zyro.png:** Add cover image for GitHub repository The commit adds a cover image for the GitHub repository. The image is located in the .github/assets directory and is named cover-github-zyro.png. ([0fd5cc4](https://github.com/nyxblabs/zyro/commit/0fd5cc4))

### ❤️  Contributors

- Nyxb <contact@nyxb.xyz>

