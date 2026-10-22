import { FRESNEL_GLSL, NOISE_GLSL } from './common'

export const ORB_VERTEX = /* glsl */ `
${NOISE_GLSL}

uniform float uTime;
uniform float uNoiseAmp;
uniform float uFrequency;
uniform float uSpeed;

varying vec3 vNormalW;
varying vec3 vViewDir;
varying float vNoise;
varying vec3 vLocal;

void main() {
  vec3 p = position;
  float t = uTime * uSpeed;

  float n = aura_fbm(normalize(p) * uFrequency + vec3(0.0, t * 0.35, t * 0.18));
  float ridge = 1.0 - abs(aura_noise(normalize(p) * (uFrequency * 2.4) - vec3(t * 0.22, 0.0, t * 0.14)));
  ridge = pow(clamp(ridge, 0.0, 1.0), 2.0);

  float displacement = n * 0.75 + ridge * 0.45 - 0.35;
  vNoise = displacement;

  vec3 displaced = p + normal * displacement * uNoiseAmp;
  vLocal = displaced;

  vec4 worldPosition = modelMatrix * vec4(displaced, 1.0);
  vNormalW = normalize(mat3(modelMatrix) * normal);
  vViewDir = normalize(cameraPosition - worldPosition.xyz);

  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`

export const ORB_FRAGMENT = /* glsl */ `
${FRESNEL_GLSL}

uniform vec3 uColorDeep;
uniform vec3 uColorMid;
uniform vec3 uColorRim;
uniform float uTime;
uniform float uRimPower;
uniform float uGlow;
uniform float uOpacity;

varying vec3 vNormalW;
varying vec3 vViewDir;
varying float vNoise;
varying vec3 vLocal;

void main() {
  float fresnel = aura_fresnel(vNormalW, vViewDir, uRimPower);

  // Band the noise into a two-tone gradient that drifts over time.
  float band = clamp(vNoise * 0.9 + 0.5, 0.0, 1.0);
  float drift = 0.5 + 0.5 * sin(vLocal.y * 1.7 + uTime * 0.6);
  band = clamp(band * 0.7 + drift * 0.3, 0.0, 1.0);

  vec3 base = mix(uColorDeep, uColorMid, band);

  // Iridescent sheen that only shows near the silhouette.
  float sheenPhase = fresnel * 2.6 + uTime * 0.35 + vNoise * 1.4;
  vec3 sheen = 0.5 + 0.5 * cos(6.28318 * (vec3(0.0, 0.33, 0.67) + sheenPhase * 0.22));

  vec3 color = base;
  color += sheen * pow(fresnel, 2.0) * 0.85;
  color += uColorRim * pow(fresnel, 3.5) * uGlow;
  color += uColorMid * 0.25 * smoothstep(0.55, 1.0, band);

  // Inner core glow, strongest where the surface faces the camera.
  float core = pow(clamp(dot(vNormalW, vViewDir), 0.0, 1.0), 3.0);
  color += uColorMid * core * 0.18;

  gl_FragColor = vec4(color, uOpacity);
}
`
