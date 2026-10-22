export const PARTICLE_VERTEX = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
uniform float uSize;
uniform float uSpread;

attribute float aSeed;
attribute float aScale;

varying float vTwinkle;
varying float vSeed;

void main() {
  vec3 transformed = position;

  // Lazy vertical drift — enough to feel alive, cheap enough to always run.
  transformed.y += sin(uTime * 0.25 + aSeed * 6.2831) * uSpread;
  transformed.x += cos(uTime * 0.18 + aSeed * 12.566) * uSpread * 0.6;

  vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  float twinkle = 0.55 + 0.45 * sin(uTime * (0.8 + aScale * 1.6) + aSeed * 30.0);
  vTwinkle = twinkle;
  vSeed = aSeed;

  float size = uSize * aScale * (0.6 + twinkle * 0.6);
  gl_PointSize = size * uPixelRatio * (300.0 / max(-mvPosition.z, 0.001));
}
`

export const PARTICLE_FRAGMENT = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uOpacity;

varying float vTwinkle;
varying float vSeed;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  if (d > 0.5) discard;

  float falloff = smoothstep(0.5, 0.0, d);
  float alpha = pow(falloff, 1.8) * vTwinkle * uOpacity;

  vec3 color = mix(uColorA, uColorB, vSeed);
  color += vec3(1.0) * pow(falloff, 8.0) * 0.55;

  gl_FragColor = vec4(color, alpha);
}
`
