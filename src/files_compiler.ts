import path from 'path'
import { compile } from 'glslify'
import { Plugin } from 'vite'

import type { Filter, GlslifyOptions } from './types'

export function filesCompiler(extFilter: Filter, options: GlslifyOptions): Plugin {
  return {
    name: 'vite-plugin-glslify:files',
    transform(code, id) {
      if (extFilter(id)) {
        return {
          code: `export default \`${compile(code, {
            ...options,
            basedir: path.dirname(id)
          })}\``
        }
      }
      return null
    },
    handleHotUpdate(ctx) {
      if (!extFilter(ctx.file)) return
      const defaultRead = ctx.read
      ctx.read = async () => {
        return compile(await defaultRead(), {
          ...options,
          basedir: path.dirname(ctx.file)
        })
      }
    }
  }
}
