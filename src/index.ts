import { createFilter, FilterPattern } from '@rollup/pluginutils'
import { generate } from 'astring'
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

        const compileAndOverwrite = (node: any, start: number, end: number) => {
          const target = generate(node)
          try {
            const compiled = compile(target)
            s.overwrite(start, end, `${compiled}`)
          } catch (e) {
            this.error(e)
          }
        }

        walk(ast, {
          enter(node) {
            if (!node.type) {
              return
            }
            if (node?.type === 'TaggedTemplateExpression') {
              if (funcFilter(node.tag.name)) {
                const { start, end } = node
                compileAndOverwrite(node.quasi, start, end)
              }
            } else if (node?.type === 'CallExpression') {
              if (funcFilter(node.callee.name)) {
                const { start, end } = node
                compileAndOverwrite(node.arguments[0], start, end)
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
