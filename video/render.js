// 사용법:
//   node render.js stills <출력폴더> 3,10,40     -> 지정 시각의 PNG
//   node render.js range <시작프레임> <끝프레임> <출력.mp4>  -> 구간 MP4
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const FPS = 30;
(async () => {
  const [mode, a, b, c] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('pageerror', e => console.error('PAGE ERROR', e.message));
  await page.goto('file://' + path.join(__dirname, 'index.html'));
  await page.waitForFunction(() => window.READY === true);
  await page.evaluate(() => document.fonts.ready);
  if (mode === 'stills') {
    for (const t of b.split(',').map(Number)) {
      await page.evaluate(t => seek(t), t);
      await page.screenshot({ path: path.join(a, `t${String(t).padStart(6, '0')}.png`) });
    }
  } else {
    const start = +a, end = +b;
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(FPS), c], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let f = start; f < end; f++) {
      await page.evaluate(t => seek(t), f / FPS);
      const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if ((f - start) % 300 === 0) console.log(`${path.basename(c)} frame ${f}/${end}`);
    }
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
  }
  await browser.close();
})();
