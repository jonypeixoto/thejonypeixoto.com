import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import { spawnSync } from 'node:child_process';

const { chromium } = await import(process.env.README_PLAYWRIGHT_MODULE || 'playwright');
const ffmpeg = process.env.README_FFMPEG || 'ffmpeg';
const here = dirname(fileURLToPath(import.meta.url));
const media = resolve(here, '../media');
const temp = join(here, 'frames/site');
const origin = process.env.README_SITE_URL || 'http://localhost:5300';
mkdirSync(media, { recursive: true });
mkdirSync(temp, { recursive: true });
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
const errors = [];
try {
  const context = await browser.newContext({
    viewport: { width: 1456, height: 840 }, locale: 'pt-BR',
    recordVideo: { dir: temp, size: { width: 960, height: 554 } },
  });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`${origin}/?lang=pt`);
  await page.waitForTimeout(9500);
  const recording = page.video();
  await context.close();
  const input = await recording.path();
  const filter = 'fps=10,scale=800:-2:flags=lanczos,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=bayer:bayer_scale=4';
  const result = spawnSync(ffmpeg, ['-y', '-hide_banner', '-loglevel', 'error', '-ss', '0.5', '-i', input, '-t', '9', '-vf', filter, '-loop', '0', join(media, 'site-demo.gif')], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr || 'FFmpeg indisponível');
  for (const [name, width, height] of [['desktop',1456,840],['mobile',390,844]]) {
    const p = await browser.newPage({ viewport: { width, height }, locale: 'pt-BR' });
    p.on('pageerror', error => errors.push(error.message));
    await p.goto(`${origin}/?pronto&lang=pt`);
    await p.waitForTimeout(1800);
    await p.screenshot({ path: join(media, `site-${name}.png`) });
    await p.close();
  }
  writeFileSync(join(temp,'capture-report.json'), JSON.stringify({ origin, errors },null,2));
  console.log(JSON.stringify({ demo: 'site-demo.gif', screenshots: 2, errors }));
} finally { await browser.close(); }
