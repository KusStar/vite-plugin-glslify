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

It will transpile **glsl\`...\`** or **glsl(\`...\`)**.

Other details, see [glslify](https://github.com/glslify/glslify).

## Example


```js
const frag = glsl`
  #pragma glslify: ease = require('glsl-easings/sine-in')
  precision mediump float;

  varying vec3 vpos;
  void main () {
    gl_FragColor = vec4(ease(vpos*25.0),1);
  }
`
```

Will be transpile to

```js
const frag = `
  #ifndef HALF_PI
  #define HALF_PI 1.5707963267948966
  #endif

  float sineIn(float t) {
    return sin((t - 1.0) * HALF_PI) + 1.0;
  }

  precision mediump float;

  varying vec3 vpos;
  void main () {
    gl_FragColor = vec4(ease(vpos*25.0),1);
  }
`
```


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
   * function calling that should be compiled, defaults to [/glsl/]
   */
  funcName?: FilterPattern
}
```

## LICENSE

[MIT](./LICENSE)