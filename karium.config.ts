import { defineBuildConfig } from 'buildkarium'

export default defineBuildConfig({
   declaration: true,
   rollup: {
      emitCJS: true,
      inlineDependencies: true,
   },
   entries: ['src/index'],
})
