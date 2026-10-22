/* ============================================================
   AURA.EXE — 3D portfolio engine
   aura orb + smoke + slime + bloom + chaos buttons
   ============================================================ */

import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const MOBILE  = matchMedia('(max-width: 820px)').matches;
const FINE    = matchMedia('(hover:hover) and (pointer:fine)').matches;

/* ------------------------------------------------------------
   Renderer / scene / camera
   ------------------------------------------------------------ */
const canvas = document.getElementById('webgl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: !MOBILE, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, MOBILE ? 1.5 : 2));
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x05060a, 0.055);

const camera = new THREE.PerspectiveCamera(52, innerWidth / innerHeight, 0.1, 120);
camera.position.set(0, 0, 6.4);

const orbGroup = new THREE.Group();
scene.add(orbGroup);

/* ------------------------------------------------------------
   Canvas textures (smoke puff + glow dot)
   ------------------------------------------------------------ */
function puffTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,255,255,0.85)');
  g.addColorStop(0.45, 'rgba(255,255,255,0.28)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
function dotTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.25, 'rgba(255,255,255,0.7)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
const TEX_PUFF = puffTexture();
const TEX_DOT = dotTexture();

/* ------------------------------------------------------------
   GLSL noise (Ashima simplex 3D)
   ------------------------------------------------------------ */
const NOISE = /* glsl */`
vec3 mod289(vec3 x){return x - floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x - floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}`;

/* ------------------------------------------------------------
   The AURA ORB
   ------------------------------------------------------------ */
const orbUniforms = {
  uTime:  { value: 0 },
  uAmp:   { value: REDUCED ? 0.14 : 0.30 },
  uPulse: { value: 0 },
  uBoost: { value: 1 }
};

const orbMaterial = new THREE.ShaderMaterial({
  uniforms: orbUniforms,
  vertexShader: NOISE + /* glsl */`
    uniform float uTime, uAmp, uPulse;
    varying vec3 vNormal;
    varying vec3 vView;
    varying float vNoise;
    void main(){
      vec3 dir = normalize(position);
      float n  = snoise(dir * 1.6 + uTime * 0.25);
      n += 0.5  * snoise(dir * 3.4 - uTime * 0.18);
      n += 0.25 * snoise(dir * 7.0 + uTime * 0.10);
      vNoise = n;
      vec3 pos = position + normal * n * (uAmp + uPulse);
      vNormal = normalize(normalMatrix * normal);
      vec4 mv = modelViewMatrix * vec4(pos, 1.0);
      vView = normalize(-mv.xyz);
      gl_Position = projectionMatrix * mv;
    }`,
  fragmentShader: /* glsl */`
    uniform float uTime, uPulse, uBoost;
    varying vec3 vNormal;
    varying vec3 vView;
    varying float vNoise;
    vec3 palette(float t){
      return 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67)));
    }
    void main(){
      vec3 N = normalize(vNormal);
      vec3 V = normalize(vView);
      float fres = pow(1.0 - abs(dot(N, V)), 2.4);
      float t = vNoise * 0.30 + uTime * 0.05 + fres * 0.55;
      // dark iridescent body, hot rim
      vec3 col = palette(t) * 0.42;
      col = mix(col, vec3(0.38, 0.78, 0.12), smoothstep(0.6, 1.35, vNoise) * 0.75);
      col += fres * vec3(0.42, 0.85, 0.60) * 0.85;
      col += (uPulse + uBoost * 0.12) * vec3(0.35, 0.7, 0.30);
      gl_FragColor = vec4(col, 1.0);
    }`
});

const orb = new THREE.Mesh(new THREE.IcosahedronGeometry(1.55, MOBILE ? 4 : 5), orbMaterial);
orbGroup.add(orb);

// wireframe aura shell
const shell = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1.95, 2),
  new THREE.MeshBasicMaterial({
    color: 0x3df5ff, wireframe: true, transparent: true,
    opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false
  })
);
orbGroup.add(shell);

// orbit rings
const rings = [];
const ringSpecs = [
  { r: 2.5, c: 0x9dff3b, rx: 1.15, rz: 0.35 },
  { r: 3.1, c: 0xb06bff, rx: -0.7, rz: 1.0 },
  { r: 3.7, c: 0xff4dd2, rx: 0.4, rz: -1.25 }
];
for (const s of ringSpecs) {
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(s.r, 0.012, 8, 220),
    new THREE.MeshBasicMaterial({
      color: s.c, transparent: true, opacity: 0.5,
      blending: THREE.AdditiveBlending, depthWrite: false
    })
  );
  ring.rotation.set(s.rx, 0, s.rz);
  rings.push(ring);
  orbGroup.add(ring);
}

/* ------------------------------------------------------------
   Particles: smoke / embers / slime
   ------------------------------------------------------------ */
function makePoints({ count, size, tex, color, opacity, blending, area }) {
  const pos = new Float32Array(count * 3);
  const seed = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * area.x;
    pos[i * 3 + 1] = (Math.random() - 0.5) * area.y;
    pos[i * 3 + 2] = (Math.random() - 0.5) * area.z - (area.back || 0);
    seed[i * 3]     = Math.random();
    seed[i * 3 + 1] = Math.random();
    seed[i * 3 + 2] = Math.random();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 3));
  const mat = new THREE.PointsMaterial({
    size, map: tex, color, transparent: true, opacity,
    depthWrite: false, blending, sizeAttenuation: true
  });
  return { points: new THREE.Points(geo, mat), geo, mat };
}

// --- volumetric-ish smoke
const SMOKE_COUNT = MOBILE ? 160 : 380;
const smoke = makePoints({
  count: SMOKE_COUNT, size: 5.5, tex: TEX_PUFF, color: 0x6b6f8a,
  opacity: 0.075, blending: THREE.NormalBlending,
  area: { x: 26, y: 16, z: 22, back: 6 }
});
scene.add(smoke.points);
const smokeBase = smoke.geo.attributes.position.array.slice();

// --- embers (glowing dust)
const EMBER_COUNT = MOBILE ? 200 : 480;
const emberColors = new Float32Array(EMBER_COUNT * 3);
const palette = [
  new THREE.Color(0x9dff3b), new THREE.Color(0x3df5ff),
  new THREE.Color(0xb06bff), new THREE.Color(0xff4dd2)
];
for (let i = 0; i < EMBER_COUNT; i++) {
  const c = palette[(Math.random() * palette.length) | 0];
  emberColors[i * 3] = c.r; emberColors[i * 3 + 1] = c.g; emberColors[i * 3 + 2] = c.b;
}
const ember = makePoints({
  count: EMBER_COUNT, size: 0.075, tex: TEX_DOT, color: 0xffffff,
  opacity: 0.95, blending: THREE.AdditiveBlending,
  area: { x: 22, y: 14, z: 18, back: 4 }
});
ember.geo.setAttribute('color', new THREE.BufferAttribute(emberColors, 3));
ember.mat.vertexColors = true;
ember.mat.size = 0.075;
scene.add(ember.points);

// --- slime drips falling through the scene
const SLIME_COUNT = MOBILE ? 90 : 190;
const slime = makePoints({
  count: SLIME_COUNT, size: 0.16, tex: TEX_DOT, color: 0x9dff3b,
  opacity: 0.85, blending: THREE.AdditiveBlending,
  area: { x: 20, y: 18, z: 14, back: 3 }
});
scene.add(slime.points);
const slimeSpeed = new Float32Array(SLIME_COUNT);
for (let i = 0; i < SLIME_COUNT; i++) slimeSpeed[i] = 0.6 + Math.random() * 1.6;

/* ------------------------------------------------------------
   Neon floor grid
   ------------------------------------------------------------ */
const grid = new THREE.GridHelper(70, 70, 0x9dff3b, 0x1d3a12);
grid.position.y = -4.2;
grid.material.transparent = true;
grid.material.opacity = 0.16;
grid.material.fog = true;
scene.add(grid);

/* ------------------------------------------------------------
   Post-processing: bloom + grade (aberration/vignette/grain)
   ------------------------------------------------------------ */
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloom = new UnrealBloomPass(
  new THREE.Vector2(innerWidth, innerHeight),
  MOBILE ? 0.55 : 0.72, 0.55, 0.45
);
composer.addPass(bloom);

const GradeShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uShake: { value: 0 }
  },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse;
    uniform float uTime;
    varying vec2 vUv;
    void main(){
      vec2 uv = vUv;
      vec2 dir = uv - 0.5;
      float d = dot(dir, dir);
      float amt = 0.0035 + d * 0.020;
      vec3 col;
      col.r = texture2D(tDiffuse, uv - dir * amt).r;
      col.g = texture2D(tDiffuse, uv).g;
      col.b = texture2D(tDiffuse, uv + dir * amt).b;
      float vig = smoothstep(0.85, 0.18, d * 2.0);
      col *= mix(0.5, 1.0, vig);
      float grain = fract(sin(dot(uv * (mod(uTime, 10.0) + 1.0), vec2(12.9898, 78.233))) * 43758.5453);
      col += (grain - 0.5) * 0.045;
      gl_FragColor = vec4(col, 1.0);
    }`
};
const grade = new ShaderPass(GradeShader);
composer.addPass(grade);

/* ------------------------------------------------------------
   Pointer / scroll state
   ------------------------------------------------------------ */
const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
addEventListener('pointermove', (e) => {
  pointer.tx = (e.clientX / innerWidth) * 2 - 1;
  pointer.ty = -((e.clientY / innerHeight) * 2 - 1);
});

let scrollP = 0;
function updateScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  scrollP = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
}
addEventListener('scroll', updateScroll, { passive: true });
updateScroll();

/* ------------------------------------------------------------
   Resize
   ------------------------------------------------------------ */
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  composer.setSize(innerWidth, innerHeight);
  bloom.setSize(innerWidth, innerHeight);
  updateScroll();
});

/* ------------------------------------------------------------
   Animation loop
   ------------------------------------------------------------ */
const clock = new THREE.Clock();
let shake = 0;
let boost = 0; // "smoke the class" intensity
let firstFrame = true;

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();
  const dt = Math.min(clock.getDelta(), 0.05) || 0.016;

  // pointer easing
  pointer.x += (pointer.tx - pointer.x) * 0.05;
  pointer.y += (pointer.ty - pointer.y) * 0.05;

  // orb
  orbUniforms.uTime.value = t;
  orbUniforms.uPulse.value *= 0.94;
  orbUniforms.uBoost.value = boost;
  orb.rotation.y = t * 0.16 + pointer.x * 0.5 + scrollP * 2.2;
  orb.rotation.x = pointer.y * 0.35 + scrollP * 0.5;

  shell.rotation.y = -t * 0.1;
  shell.rotation.z = t * 0.05;
  shell.material.opacity = 0.14 + boost * 0.18;

  rings.forEach((r, i) => {
    r.rotation.z += 0.0025 * (i + 1) * (1 + boost);
    r.rotation.x += 0.0012 * (i % 2 ? -1 : 1);
    r.material.opacity = 0.35 + Math.sin(t * 0.8 + i) * 0.15 + boost * 0.3;
  });

  // orb recedes as you scroll down the page
  orbGroup.position.y = scrollP * 3.4;
  orbGroup.position.z = -scrollP * 5.0;
  orbGroup.position.x = Math.sin(scrollP * Math.PI * 2) * 1.2;
  const sc = 1 - scrollP * 0.35 + boost * 0.08;
  orbGroup.scale.setScalar(sc);

  // smoke drift
  const sp = smoke.geo.attributes.position.array;
  for (let i = 0; i < SMOKE_COUNT; i++) {
    const i3 = i * 3;
    sp[i3]     = smokeBase[i3]     + Math.sin(t * 0.12 + i) * 1.2;
    sp[i3 + 1] = smokeBase[i3 + 1] + ((t * (0.18 + (i % 7) * 0.03)) % 16) - 8;
    sp[i3 + 2] = smokeBase[i3 + 2] + Math.cos(t * 0.09 + i * 0.5) * 0.8;
  }
  smoke.geo.attributes.position.needsUpdate = true;
  smoke.points.rotation.y = t * 0.02;
  smoke.mat.opacity = 0.07 + boost * 0.14;

  // embers rise + swirl
  ember.points.rotation.y = t * 0.035;
  ember.points.position.y = ((t * 0.25) % 3) - 1.5;
  ember.mat.opacity = 0.85 + Math.sin(t * 2.0) * 0.1 + boost * 0.15;

  // slime drips fall
  const sl = slime.geo.attributes.position.array;
  for (let i = 0; i < SLIME_COUNT; i++) {
    const i3 = i * 3;
    sl[i3 + 1] -= slimeSpeed[i] * dt * (1 + boost * 1.6);
    if (sl[i3 + 1] < -9) {
      sl[i3 + 1] = 9;
      sl[i3] = (Math.random() - 0.5) * 20;
      sl[i3 + 2] = (Math.random() - 0.5) * 14 - 3;
    }
  }
  slime.geo.attributes.position.needsUpdate = true;
  slime.mat.size = 0.16 + boost * 0.1;
  slime.mat.opacity = 0.8 + boost * 0.2;

  // camera: parallax + scroll travel + shake
  shake *= 0.92;
  const camX = pointer.x * 0.55 + Math.sin(t * 0.3) * 0.08 + (Math.random() - 0.5) * shake;
  const camY = pointer.y * 0.35 + scrollP * 2.6 + (Math.random() - 0.5) * shake;
  const camZ = 6.4 - scrollP * 1.6;
  camera.position.set(camX, camY, camZ);
  camera.lookAt(orbGroup.position.x * 0.4, orbGroup.position.y * 0.55, orbGroup.position.z * 0.4);

  // grid + fog respond to boost
  grid.material.opacity = 0.14 + boost * 0.2;
  scene.fog.density = 0.055 - boost * 0.018;
  bloom.strength = (MOBILE ? 0.55 : 0.72) + boost * 0.6 + orbUniforms.uPulse.value * 0.5;

  grade.uniforms.uTime.value = t;
  composer.render();

  if (firstFrame) {
    firstFrame = false;
    setTimeout(() => document.getElementById('loader').classList.add('done'), 450);
  }
}
animate();

/* ------------------------------------------------------------
   FX: custom cursor, splats, aura meter
   ------------------------------------------------------------ */
const fxLayer = document.getElementById('fx-layer');
const cursorEl = document.getElementById('cursor');
const auraEl = document.getElementById('aura-count');
const meterEl = document.querySelector('.aura-meter');

let aura = 0;
function addAura(n) {
  aura += n;
  auraEl.textContent = aura.toLocaleString();
  meterEl.classList.remove('bump');
  void meterEl.offsetWidth;
  meterEl.classList.add('bump');
}
addAura(1000); // starting flex

if (FINE) {
  const cur = { x: innerWidth / 2, y: innerHeight / 2, tx: innerWidth / 2, ty: innerHeight / 2 };
  addEventListener('pointermove', (e) => {
    cur.tx = e.clientX; cur.ty = e.clientY;
    addAura(1);
  });
  (function moveCursor() {
    cur.x += (cur.tx - cur.x) * 0.22;
    cur.y += (cur.ty - cur.y) * 0.22;
    cursorEl.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0)`;
    requestAnimationFrame(moveCursor);
  })();

  document.addEventListener('pointerover', (e) => {
    if (e.target.closest('a, button, .card')) cursorEl.classList.add('big');
  });
  document.addEventListener('pointerout', (e) => {
    if (e.target.closest('a, button, .card')) cursorEl.classList.remove('big');
  });
  addEventListener('pointerdown', () => cursorEl.classList.add('down'));
  addEventListener('pointerup', () => cursorEl.classList.remove('down'));
}

// slime splat + aura gain on click
addEventListener('pointerdown', (e) => {
  if (e.target.closest('a, button')) return;

  const x = e.clientX, y = e.clientY;

  const splat = document.createElement('div');
  splat.className = 'splat';
  const size = 40 + Math.random() * 70;
  splat.style.cssText += `left:${x}px;top:${y}px;width:${size}px;height:${size}px;`;
  fxLayer.appendChild(splat);
  splat.animate(
    [
      { transform: 'translate(-50%,-50%) scale(0) rotate(0deg)', opacity: 1 },
      { transform: `translate(-50%,-50%) scale(1) rotate(${Math.random() * 40 - 20}deg)`, opacity: 1, offset: 0.35 },
      { transform: 'translate(-50%,-50%) scale(1.05) rotate(0deg)', opacity: 0 }
    ],
    { duration: 1400, easing: 'cubic-bezier(.2,.8,.3,1)' }
  ).onfinish = () => splat.remove();

  // gooey droplets falling from the splat
  for (let i = 0; i < 4; i++) {
    const drop = document.createElement('div');
    drop.className = 'drop';
    const dx = x + (Math.random() - 0.5) * size;
    drop.style.cssText += `left:${dx}px;top:${y}px;`;
    fxLayer.appendChild(drop);
    const fall = 80 + Math.random() * 220;
    drop.animate(
      [
        { transform: 'translate(-50%,0) scaleY(.6)', opacity: 1 },
        { transform: `translate(-50%,${fall}px) scaleY(1.6)`, opacity: 0 }
      ],
      { duration: 700 + Math.random() * 500, easing: 'cubic-bezier(.4,0,.9,.5)', delay: i * 60 }
    ).onfinish = () => drop.remove();
  }

  // floating +AURA text
  const gain = document.createElement('div');
  gain.className = 'gain';
  gain.textContent = '+50 AURA';
  gain.style.cssText += `left:${x}px;top:${y - 24}px;`;
  fxLayer.appendChild(gain);
  gain.animate(
    [
      { transform: 'translate(-50%,-50%) scale(.7)', opacity: 0 },
      { transform: 'translate(-50%,-160%) scale(1.1)', opacity: 1, offset: 0.3 },
      { transform: 'translate(-50%,-300%) scale(1)', opacity: 0 }
    ],
    { duration: 1100, easing: 'ease-out' }
  ).onfinish = () => gain.remove();

  addAura(50);

  // orb reacts to clicks
  orbUniforms.uPulse.value = Math.min(0.6, orbUniforms.uPulse.value + 0.35);
  shake = Math.min(0.12, shake + 0.05);
});

/* ------------------------------------------------------------
   Toast helper
   ------------------------------------------------------------ */
function toast(msg) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2500);
}

/* ------------------------------------------------------------
   SMOKE THE CLASS
   ------------------------------------------------------------ */
const smokeBtn = document.getElementById('smoke-btn');
const smokeFlash = document.getElementById('smoke-flash');
let smokeTimer = null;

smokeBtn.addEventListener('click', () => {
  boost = 1;
  shake = 0.35;
  orbUniforms.uPulse.value = 0.6;
  addAura(500);

  smokeFlash.classList.remove('on');
  void smokeFlash.offsetWidth;
  smokeFlash.classList.add('on');

  toast('💀 CLASS HAS BEEN SMOKED · +500 AURA');

  clearTimeout(smokeTimer);
  smokeTimer = setTimeout(() => { boost = 0; }, 6000);
});

/* ------------------------------------------------------------
   SLIME 'EM
   ------------------------------------------------------------ */
const slimeBtn = document.getElementById('slime-btn');
const slimeOverlay = document.getElementById('slime-overlay');
let slimeBusy = false;

slimeBtn.addEventListener('click', () => {
  if (slimeBusy) return;
  slimeBusy = true;
  addAura(300);
  orbUniforms.uPulse.value = 0.7;
  shake = 0.3;

  slimeOverlay.classList.add('pouring');
  toast('🟢 YOU JUST GOT SLIMED · +300 AURA');

  setTimeout(() => {
    slimeOverlay.classList.remove('pouring');
    slimeBusy = false;
  }, 3500);
});

/* ------------------------------------------------------------
   Reveal on scroll
   ------------------------------------------------------------ */
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) {
      en.target.classList.add('in');
      io.unobserve(en.target);
    }
  });
}, { threshold: 0.18 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

/* ------------------------------------------------------------
   Project card tilt
   ------------------------------------------------------------ */
if (FINE && !REDUCED) {
  document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${px * 10}deg) rotateX(${-py * 10}deg) translateY(-6px)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}

/* ------------------------------------------------------------
   Milestone toasts
   ------------------------------------------------------------ */
let milestone = 5000;
setInterval(() => {
  if (aura >= milestone) {
    const lines = [
      '⚡ AURA LEVEL: DISGUSTING',
      '👑 YOUR CLASS STANDS NO CHANCE',
      '🧪 SLIME RESERVES: FULL',
      '🔥 UNDEFEATED. STILL COOKING.'
    ];
    toast(lines[(Math.random() * lines.length) | 0]);
    milestone += 5000;
  }
}, 4000);
