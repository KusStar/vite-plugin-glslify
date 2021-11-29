import { createFilter, FilterPattern } from '@rollup/pluginutils'

export type Filter = ReturnType<typeof createFilter>

export type GlslifyTransform<Options = any> = (
  filename: string,
  src: string,
  options: Options,
  done: (error: any, src: string) => void
) => string

export interface GlslifyOptions {
  transforms?: (
   GlslifyTransform | string |
   [GlslifyTransform | string, any]
  )[]
}

export interface Options {
  /**
   * included files or folder, defaults to [/\.ts$/, /\.js$/]
   */
  include?: FilterPattern
  /**
   * excluded files or folder, defaults to ['node_modules/**']
   */
  exclude?: FilterPattern
  /**
   * should transform literals with literalsCompiler, defaults to true
   */
  transformLiterals?: boolean
  /**
   * function calling that should be compiled, defaults to [/glsl/]
   */
  funcName?: FilterPattern
  /**
   * should transform files with filesCompiler, defaults to true
   */
  transformFiles?: boolean
  /**
   * extensions of files that should be compiled, defaults to [/\.vert$/, /\.frag$/, /\.glsl$/]
   */
  extensions?: FilterPattern
  /**
   * options passed to glslify
   */
  options?: GlslifyOptions
}
