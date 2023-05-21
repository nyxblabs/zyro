import { spyOn } from 'nanospy'

function noop() {}

export function mockEnvFunctions() {
   const consoleLog = spyOn(console, 'log', noop)
   const consoleError = spyOn(console, 'error', noop)
   // @ts-expect-error noop
   const processExit = spyOn(process, 'exit', noop)

   return {
      consoleLog,
      consoleError,
      processExit,
      restore() {
         consoleLog.restore()
         consoleError.restore()
         processExit.restore()
      },
   }
}
