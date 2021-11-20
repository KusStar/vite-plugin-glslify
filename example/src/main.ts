import './style.css'

// @ts-ignore
const glsl = (...args: any[]) => ''

const app = document.querySelector<HTMLDivElement>('#app')!

const main = () => {
  const precision = {
    highp: 'highp'
  }

  const glslTagged = glsl`
  #pragma glslify: ease = require('glsl-easings/sine-in')
  precision ${precision.highp} float;

  varying vec3 vpos;
  void main () {
    gl_FragColor = vec4(ease(vpos*25.0),1);
  }
`

  const glslCalled = glsl(`
#pragma glslify: ease = require('glsl-easings/sine-in')
precision ${precision.highp} float;

varying vec3 vpos;
void main () {
  gl_FragColor = vec4(ease(vpos*25.0),1);
}
`)

  console.log(glslTagged, glslCalled)
}

main()

app.innerHTML = `
  <h1>Hello Vite!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`
