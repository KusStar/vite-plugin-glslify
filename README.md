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

Will be transpiled to

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

Or you can import files with extensions like `*.glsl`, `*.vert`, `*.frag`, see [example](./example).

## Interfaces

```ts
/**
 * A valid `minimatch` pattern, or array of patterns.
 */
export type FilterPattern = ReadonlyArray<string | RegExp> | string | RegExp | null;

import { Plugin } from 'vite';
import { FilterPattern } from '@rollup/pluginutils';

interface Options {
    /**
     * included files or folder, defaults to [/\.ts$/, /\.js$/]
     */
    include?: FilterPattern;
    /**
     * excluded files or folder, defaults to ['node_modules/**']
     */
    exclude?: FilterPattern;
    /**
     * should transform files with literalsCompiler, defaults to true
     */
    transformLiterals?: boolean;
    /**
     * function calling that should be compiled, defaults to [/glsl/]
     */
    funcName?: FilterPattern;
    /**
     * should transform files with filesCompiler, defaults to true
     */
    transformFiles?: boolean;
    /**
     * extensions of files that should be compiled, defaults to [/\.vert$/, /\.frag$/, /\.glsl$/]
     */
    extensions?: FilterPattern;
}

declare const DEFAULT_EXTENSIONS: RegExp[];
declare function glslifyCompiler(options?: Options): Plugin[];
export { DEFAULT_EXTENSIONS, glslifyCompiler as default, glslifyCompiler };
```

## LICENSE

[MIT](./LICENSE)