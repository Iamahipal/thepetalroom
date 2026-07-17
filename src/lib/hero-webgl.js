import { allowWebGL, isMobile } from './motion.js';

/**
 * Soft "grainy aurora" backdrop for the hero — flowing brand-colour light
 * with drifting glow spots and film grain, gently reacting to the pointer.
 * Rendered with OGL (tiny). Lazy, capability-gated, pauses off-screen/hidden.
 */
export async function initHeroWebGL(canvas) {
  if (!canvas || !allowWebGL) return null;

  let mod;
  try { mod = await import('ogl'); }
  catch { return null; }
  const { Renderer, Program, Mesh, Triangle, Vec2 } = mod;

  const renderer = new Renderer({
    canvas,
    alpha: true,
    antialias: false,
    dpr: Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2),
  });
  const gl = renderer.gl;
  gl.clearColor(0, 0, 0, 0);

  const vertex = /* glsl */ `
    attribute vec2 uv;
    attribute vec2 position;
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }
  `;

  const fragment = /* glsl */ `
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform vec2 uRes;
    uniform vec2 uMouse;

    // palette (brand)
    vec3 cCream = vec3(0.984, 0.965, 0.945);
    vec3 cRose  = vec3(0.851, 0.541, 0.580);
    vec3 cSage  = vec3(0.561, 0.639, 0.510);
    vec3 cHoney = vec3(0.906, 0.722, 0.314);
    vec3 cPlum  = vec3(0.263, 0.153, 0.180);

    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
    float noise(vec2 p){
      vec2 i=floor(p), f=fract(p);
      float a=hash(i), b=hash(i+vec2(1.0,0.0)), c=hash(i+vec2(0.0,1.0)), d=hash(i+vec2(1.0,1.0));
      vec2 u=f*f*(3.0-2.0*f);
      return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
    }
    float fbm(vec2 p){
      float v=0.0, a=0.5;
      for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.0; a*=0.5; }
      return v;
    }
    // soft radial glow
    float glow(vec2 uv, vec2 c, float r){ return smoothstep(r, 0.0, distance(uv, c)); }

    void main(){
      vec2 uv = vUv;
      float agp = uRes.x / uRes.y;
      vec2 p = uv; p.x *= agp;
      vec2 m = uMouse; m.x *= agp;

      float t = uTime * 0.05;
      vec2 q = p + vec2(fbm(p*1.6 + t), fbm(p*1.6 - t + 5.2)) * 0.35;
      float f = fbm(q*2.0 + t*0.6);

      vec3 col = cCream;
      col = mix(col, cRose, smoothstep(0.35, 0.9, f) * 0.55);
      col = mix(col, cSage, smoothstep(0.2, 0.7, fbm(q*1.3 - t)) * 0.30);
      col = mix(col, cHoney, smoothstep(0.55, 1.0, fbm(q*2.4 + t*1.3)) * 0.18);

      // drifting glow spots that drift + follow mouse slightly
      float g = 0.0;
      g += glow(p, vec2(0.75*agp + sin(t*2.0)*0.12 + m.x*0.05, 0.7 + cos(t*1.7)*0.08 + m.y*0.05), 0.55);
      g += glow(p, vec2(0.25*agp + cos(t*1.3)*0.14, 0.35 + sin(t*2.2)*0.1), 0.5);
      col = mix(col, mix(cRose, cCream, 0.3), g * 0.35);

      // subtle top vignette toward cream so text stays readable
      col = mix(col, cCream, smoothstep(0.55, 1.15, uv.y) * 0.35);

      // film grain
      float grain = hash(uv * uRes.xy + uTime) * 0.05 - 0.025;
      col += grain;

      // fade edges to transparent for a soft blend with the page
      float alpha = 0.9;
      gl_FragColor = vec4(col, alpha);
    }
  `;

  const program = new Program(gl, {
    vertex, fragment,
    uniforms: {
      uTime: { value: 0 },
      uRes: { value: new Vec2(1, 1) },
      uMouse: { value: new Vec2(0.5, 0.5) },
    },
  });
  const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

  function resize() {
    const { clientWidth: w, clientHeight: h } = canvas;
    renderer.setSize(w, h);
    program.uniforms.uRes.value.set(gl.drawingBufferWidth, gl.drawingBufferHeight);
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  // pointer influence (smoothed)
  const target = { x: 0.5, y: 0.5 };
  const cur = { x: 0.5, y: 0.5 };
  window.addEventListener('pointermove', (e) => {
    target.x = e.clientX / window.innerWidth;
    target.y = 1 - e.clientY / window.innerHeight;
  }, { passive: true });

  let raf = 0, running = true, start = performance.now();
  function frame(now) {
    if (!running) return;
    cur.x += (target.x - cur.x) * 0.05;
    cur.y += (target.y - cur.y) * 0.05;
    program.uniforms.uMouse.value.set(cur.x, cur.y);
    program.uniforms.uTime.value = (now - start) / 1000;
    renderer.render({ scene: mesh });
    raf = requestAnimationFrame(frame);
  }
  function play() { if (!running) { running = true; start = performance.now() - program.uniforms.uTime.value * 1000; raf = requestAnimationFrame(frame); } }
  function pause() { running = false; cancelAnimationFrame(raf); }

  // pause when hero scrolls away or tab hidden
  const io = new IntersectionObserver(([e]) => (e.isIntersecting ? play() : pause()), { threshold: 0.01 });
  io.observe(canvas);
  document.addEventListener('visibilitychange', () => (document.hidden ? pause() : play()));

  raf = requestAnimationFrame(frame);
  canvas.classList.add('ready');
  return { pause, play, destroy() { pause(); ro.disconnect(); io.disconnect(); } };
}
