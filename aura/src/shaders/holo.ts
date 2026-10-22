export const HOLO_VERTEX = /* glsl */ `
varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vViewDir;

void main() {
  vUv = uv;
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vNormalW = normalize(mat3(modelMatrix) * normal);
  vViewDir = normalize(cameraPosition - worldPosition.xyz);
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`

export const HOLO_FRAGMENT = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uLineColor;
uniform float uTime;
uniform float uOpacity;
uniform float uGrid;
uniform float uScan;

varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vViewDir;

void main() {
  float fresnel = pow(clamp(1.0 - dot(normalize(vNormalW), normalize(vViewDir)), 0.0, 1.0), 2.2);

  // Vertical gradient across the panel.
  float g = smoothstep(0.0, 1.0, vUv.y);
  vec3 base = mix(uColorA, uColorB, g);

  // Blueprint grid.
  vec2 grid = abs(fract(vUv * vec2(14.0, 22.0)) - 0.5);
  float lines = 1.0 - smoothstep(0.0, 0.06, min(grid.x, grid.y));
  base += uLineColor * lines * uGrid;

  // Sweeping scanline.
  float sweep = smoothstep(0.0, 0.12, abs(fract(vUv.y - uTime * 0.16) - 0.5));
  base += uLineColor * (1.0 - sweep) * uScan;

  // Edge glow.
  vec2 edge = min(vUv, 1.0 - vUv);
  float border = 1.0 - smoothstep(0.0, 0.03, min(edge.x, edge.y));

  vec3 color = base * (0.55 + fresnel * 0.85);
  color += uLineColor * border * 1.4;
  color += uColorB * fresnel * 0.5;

  float alpha = uOpacity * (0.30 + fresnel * 0.75 + border * 0.55 + lines * 0.12);

  gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
}
`
