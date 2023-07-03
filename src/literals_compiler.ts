import { generate } from 'astring'
import { walk } from 'estree-walker'
import { compile } from 'glslify'
import MagicString from 'magic-string'
import path from 'path'
import { Plugin } from 'vite'

import type { Filter, GlslifyOptions } from './types'

export function literalsCompiler(
  idFilter: Filter,
  funcFilter: Filter,
  options: GlslifyOptions
): Plugin {
  return {
    name: 'vite-plugin-glslify:literals',
    transform(code, id) {
      if (!idFilter(id)) return undefined
      if (funcFilter(code)) {
        const ast = this.parse(code)
        const s = new MagicString(code)

        const compileAndOverwrite = (node: any, start: number, end: number) => {
          const target = generate(node)
          try {
            const compiled = compile(target.replace(/`/g, ''), {
              ...options,
              basedir: path.dirname(id),
            })
            s.overwrite(start, end, `\`${compiled}\``)
          } catch (e) {
            this.error(e.message)
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
          },
        })

        return {
          code: s.toString(),
        }
      }
      return undefined
    },
  }
}
