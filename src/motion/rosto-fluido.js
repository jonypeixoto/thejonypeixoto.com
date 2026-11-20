import { gsap } from 'gsap';

// Campo de velocidade pequeno: a máscara revela o vídeo, nunca desloca o retrato.
export function rostoFluido(camada) {
  const w = 80, h = 128, n = w * h;
  let vx = new Float32Array(n), vy = new Float32Array(n);
  let nx = new Float32Array(n), ny = new Float32Array(n);
  let p = new Float32Array(n), q = new Float32Array(n);
  let dye = new Float32Array(n), nextDye = new Float32Array(n);
  const div = new Float32Array(n), pixels = new Uint8Array(n * 4);
  const progress = { x: 0, y: 0 };
  const idle = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 3 })
    .to(progress, { y: 1, duration: 2.5, ease: 'none' }, 0)
    .to(progress, { x: 1, duration: 2.5, ease: 'power1.inOut' }, 0)
    .to(progress, { y: 0, duration: 2.5, ease: 'none' }, 4)
    .to(progress, { x: 0, duration: 2.5, ease: 'power1.inOut' }, 4);
  let clock = 0, lastTouch = 0, automatic = false, started = false;
  let pointer = { x: 0.5, y: 0.3 }, previous = null, accumulated = 0;
  const hero = camada.closest('.hero');
  const eased = { x: 0.5, y: 0.3 };
  let pressed = false;
  const move = event => {
    const rect = camada.getBoundingClientRect();
    // Mesma área do vídeo alinhado à foto, em coordenadas locais.
    pointer = {
      x: (event.clientX - rect.left - rect.width * 0.1389) / (rect.width * 0.7075),
      y: (event.clientY - rect.top - rect.height * 0.00413) / (rect.width * 0.7075 * 16 / 9),
    };
    lastTouch = clock;
    pressed ||= event.type === 'pointerdown';
    if (automatic) { idle.pause(); automatic = false; previous = null; }
  };
  hero.addEventListener('pointermove', move, { passive: true });
  hero.addEventListener('pointerdown', move, { passive: true });
  const sample = (field, x, y) => {
    x = Math.max(0, Math.min(w - 1.001, x));
    y = Math.max(0, Math.min(h - 1.001, y));
    const ix = x | 0, iy = y | 0, fx = x - ix, fy = y - iy, i = iy * w + ix;
    return (field[i] * (1 - fx) + field[i + 1] * fx) * (1 - fy)
      + (field[i + w] * (1 - fx) + field[i + w + 1] * fx) * fy;
  };
  const step = () => {
    if (!automatic && clock - lastTouch > (started ? 2 : 2.5)) {
      automatic = true; started = true; previous = null;
      idle.restart();
    }
    eased.x += (pointer.x - eased.x) * 0.35;
    eased.y += (pointer.y - eased.y) * 0.35;
    const point = automatic ? {
      x: 0.5 - Math.cos(progress.x * Math.PI * 4) * 0.43,
      y: 0.34 - Math.cos(progress.y * Math.PI) * 0.09,
    } : eased;
    // Advecção e projeção curvam o rastro em vez de desenhar círculos.
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = y * w + x, sx = x - vx[i] * 0.8, sy = y - vy[i] * 0.8;
      nx[i] = sample(vx, sx, sy) * 0.96;
      ny[i] = sample(vy, sx, sy) * 0.96;
      nextDye[i] = sample(dye, sx, sy) * 0.985;
    }
    [vx, nx] = [nx, vx]; [vy, ny] = [ny, vy];
    [dye, nextDye] = [nextDye, dye];
    if (previous || pressed) {
      previous ||= { ...point };
      const dx = Math.max(-0.12, Math.min(0.12, point.x - previous.x));
      const dy = Math.max(-0.12, Math.min(0.12, point.y - previous.y));
      // Interpola o segmento: movimentos rápidos não deixam buracos no rastro.
      const distance = Math.hypot(dx * w, dy * h);
      const segments = Math.max(1, Math.ceil(distance / 2));
      const amount = pressed ? 0.85 : Math.min(1, distance * 0.65);
      for (let segment = 1; segment <= segments; segment++) {
        const t = segment / segments;
        const cx = (previous.x + dx * t) * w, cy = (previous.y + dy * t) * h, radius = 14;
        for (let y = Math.max(1, Math.floor(cy - radius)); y < Math.min(h - 1, cy + radius); y++) {
          for (let x = Math.max(1, Math.floor(cx - radius)); x < Math.min(w - 1, cx + radius); x++) {
            const d = Math.hypot(x - cx, y - cy) / radius;
            if (d >= 1) continue;
            const force = (1 - d) ** 2 * 50, i = y * w + x;
            vx[i] += dx * force; vy[i] += dy * force;
            dye[i] = Math.min(1, dye[i] + (1 - d) ** 2 * amount);
          }
        }
      }
    }
    pressed = false;
    previous = { ...point };
    p.fill(0);
    for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      div[i] = (vx[i + 1] - vx[i - 1] + vy[i + w] - vy[i - w]) * 0.5;
    }
    for (let k = 0; k < 4; k++) {
      for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
        const i = y * w + x;
        q[i] = (p[i - 1] + p[i + 1] + p[i - w] + p[i + w] - div[i]) / 5;
      }
      [p, q] = [q, p];
    }
    for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      vx[i] -= (p[i + 1] - p[i - 1]) * 0.5;
      vy[i] -= (p[i + w] - p[i - w]) * 0.5;
      pixels[i * 4] = Math.min(255, dye[i] * 255);
      pixels[i * 4 + 3] = 255;
    }
  };
  return {
    width: w, height: h, pixels,
    update(dt) {
      if (automatic && idle.paused()) idle.resume();
      clock += dt;
      accumulated += Math.min(dt, 1 / 30);
      while (accumulated >= 1 / 60) { step(); accumulated -= 1 / 60; }
    },
    pause() { idle.pause(); },
    reset() {
      vx.fill(0); vy.fill(0); pixels.fill(0); previous = null;
      dye.fill(0); nextDye.fill(0); pressed = false;
      accumulated = 0; eased.x = pointer.x; eased.y = pointer.y;
      clock = 0; lastTouch = 0; started = automatic = false; idle.pause(0);
    },
  };
}
