import { mkdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import { spawnSync } from 'node:child_process';

// Variáveis opcionais permitem usar uma instalação local já disponível.
const { chromium } = await import(process.env.README_PLAYWRIGHT_MODULE || 'playwright');
const ffmpeg = process.env.README_FFMPEG || 'ffmpeg';
const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, '../media');
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
try {
  for (const [mode, filename, height] of [['hero', 'hero-3d', 440], ['orbit', 'orbit-3d', 340]]) {
    const frames = join(here, 'frames', filename);
    mkdirSync(frames, { recursive: true });
    const page = await browser.newPage({ viewport: { width: 1000, height }, deviceScaleFactor: 1 });
    await page.goto(pathToFileURL(join(here, 'scene-3d.html')).href);
    for (let i = 0; i < 90; i++) {
      await page.evaluate(({ phase, mode }) => window.renderFrame(phase, mode), { phase: i / 90, mode });
      await page.screenshot({ path: join(frames, `${String(i).padStart(4, '0')}.png`) });
    }
    const palette = '[0:v]split[a][b];[a]palettegen=max_colors=192[p];[b][p]paletteuse=dither=bayer:bayer_scale=3';
    const result = spawnSync(ffmpeg, ['-y', '-hide_banner', '-loglevel', 'error', '-framerate', '15', '-i', join(frames, '%04d.png'), '-filter_complex', palette, '-loop', '0', join(out, `${filename}.gif`)], { encoding: 'utf8' });
    if (result.status !== 0) throw new Error(result.stderr || 'FFmpeg indisponível');
    console.log(`Rendered ${filename}.gif`);
    await page.close();
  }
} finally { await browser.close(); }
