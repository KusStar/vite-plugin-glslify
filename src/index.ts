import { createFilter, FilterPattern } from '@rollup/pluginutils'
import { walk } from 'estree-walker'
import { compile } from 'glslify'
import MagicString from 'magic-string'
import { Plugin } from 'vite'

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
   * function calling that should be compiled, defaults to [/glsl/]
   */
  funcName?: FilterPattern
}

export function glslifyCompiler(options: Options = {}) {
  const filter = createFilter(
    options.include || [/\.ts$/, /\.js$/],
    options.exclude || ['node_modules/**']
  )

  const funcFilter = createFilter(options.funcName || [/glsl/])

  return <Plugin>{
    name: 'vite-plugin-glslify',
    transform(code, id) {
      if (!filter(id)) return undefined

      if (funcFilter(code)) {
        const ast = this.parse(code)
        const s = new MagicString(code)

        walk(ast, {
          enter(node) {
            const { value } = node
            if (!value) {
              return
            }
            if (value.type === 'TaggedTemplateExpression') {
              if (funcFilter(value.tag.name)) {
                const { start, end } = value
                const target = value.quasi.quasis[0]
                const raw = target.value.raw
                const compiled = compile(raw)
                s.overwrite(start, end, `\`${compiled}\``)
              }
            } else if (value.type === 'CallExpression') {
              if (funcFilter(value.callee.name)) {
                const { start, end } = value
                const target = value.arguments[0].quasis[0]
                const raw = target.value.raw
                const compiled = compile(raw)
                s.overwrite(start, end, `\`${compiled}\``)
              }
            }
          }
        })

        return {
          code: s.toString()
        }
      }
      return undefined
    }
  }
}

export default glslifyCompiler
