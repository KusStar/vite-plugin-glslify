import { compile } from 'glslify'
import path from 'path'
import { Plugin } from 'vite'

import type { Filter } from './types'

export function filesCompiler(extFilter: Filter): Plugin {
  return {
    name: 'vite-plugin-glslify:files',
    transform(code, id) {
      if (extFilter(id)) {
        return {
          code: `export default \`${compile(code, {
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
          basedir: path.dirname(ctx.file)
        })
      }
    }
  }
}
