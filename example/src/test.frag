precision highp float;

#pragma glslify: noise = require(glsl-noise/classic/3d)
#pragma glslify: pnoise = require(glsl-noise/periodic/3d)
#pragma glslify: rotateY = require(glsl-rotate/rotateY)

void main() {
  gl_FragColor = vec4(vec3(0.5), 1.0);
}