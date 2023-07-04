import './style.css'

import testFrag from './test.frag'
import testVert from './test.vert'

console.log(testVert, testFrag)

// any function wrapped by `glsl` will be transpiled to a string at build time
const glsl = (..._args: any[]) => ''

const vert = glsl`
varying vec2 vUv;
varying float vDistort;

uniform float uTime;
uniform float uSpeed;
uniform float uNoiseStrength;
uniform float uNoiseDensity;
uniform float uFreq;
uniform float uAmp;
uniform float uOffset;

#pragma glslify: noise = require(glsl-noise/classic/3d)
#pragma glslify: pnoise = require(glsl-noise/periodic/3d)
#pragma glslify: rotateY = require(glsl-rotate/rotateY)

float map(float value, float inMin, float inMax, float outMin, float outMax) {
  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

void main() {
  vUv = uv;

  float t = uTime * uSpeed;
  float distortion = pnoise((normal + t) * uNoiseDensity, vec3(10.0)) * uNoiseStrength;

  vec3 pos = position + (normal * distortion);
  float angle = sin(uv.y * uFreq + t) * uAmp;
  pos = rotateY(pos, angle);

  pos *= map(sin(uTime + uOffset), -1.0, 1.0, 1.0, 1.2);

  vDistort = distortion;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
}
      `

const frag = glsl`
varying vec2 vUv;
varying float vDistort;

uniform float uTime;
uniform float uHue;
uniform float uAlpha;

vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
  return a + b * cos(6.28318 * (c * t + d));
}

void main() {
  float distort = vDistort * 2.0;

  vec3 brightness = vec3(0.5, 0.5, 0.5);
  vec3 contrast = vec3(0.5, 0.5, 0.5);
  vec3 oscilation = vec3(1.0, 1.0, 1.0);
  vec3 phase = vec3(0.0, 0.1, 0.2);

  vec3 color = cosPalette(uHue + distort, brightness, contrast, oscilation, phase);

  gl_FragColor = vec4(color, uAlpha);
}
`

console.log(frag, vert)

const app = document.querySelector<HTMLDivElement>('#app')!

const main = () => {
  const glslTagged = glsl`
  #pragma glslify: ease = require('glsl-easings/sine-in')
  precision highp float;

  varying vec3 vpos;
  void main () {
    gl_FragColor = vec4(ease(vpos*25.0),1);
  }
`

  const glslCalled = glsl(`
#pragma glslify: ease = require('glsl-easings/sine-in')
precision highp float;

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
