import { defineConfig } from 'vite'

import glslCompiler from '../src/index'

export default defineConfig({
  plugins: [
    glslCompiler()
  ]
})
