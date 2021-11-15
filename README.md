# vite-plugin-glslify

> A plugin for Vite to compile [glslify](https://github.com/glslify/glslify) shader code

## Usage

Install

```cmd
$ yarn add --D vite-plugin-glslify
# or npm i -D vite-plugin-glslify
```

Add it to `vite.config.*`

```js
// vite.config.js
import glslifyCompiler from 'vite-plugin-glslify'

export default {
  plugins: [
    glslifyCompiler()
  ],
}
```

That's it, now it will compile your glslify shader code.

Other details, see [glslify](https://github.com/glslify/glslify)

## Options

```ts
/**
 * A valid `minimatch` pattern, or array of patterns.
 */
export type FilterPattern = ReadonlyArray<string | RegExp> | string | RegExp | null;

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
   * funcName that should compile defaults to [/glsl/]
   */
  funcName?: FilterPattern
}
```

## LICENSE

[MIT](./LICENSE)