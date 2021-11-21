import { createFilter } from '@rollup/pluginutils'
import { Plugin } from 'vite'

import { filesCompiler } from './files_compiler'
import { literalsCompiler } from './literals_compiler'
import { Options } from './types'

export const DEFAULT_EXTENSIONS = [/\.vert$/, /\.frag$/, /\.glsl$/]

export function glslifyCompiler(options: Options = {}) {
  const plugins: Plugin[] = []
  const transformFiles = options.transformFiles ?? true
  const transformLiterals = options.transformLiterals ?? true

  if (transformFiles) {
    const extFilter = createFilter(
      options.extensions || DEFAULT_EXTENSIONS
    )
    plugins.push(
      filesCompiler(extFilter)
    )
  }

  if (transformLiterals) {
    const idFilter = createFilter(
      options.include || [/\.ts$/, /\.js$/],
      options.exclude || ['node_modules/**']
    )
    const funcFilter = createFilter(options.funcName || [/glsl/])

    plugins.push(
      literalsCompiler(idFilter, funcFilter)
    )
  }

  return plugins
}

export default glslifyCompiler
