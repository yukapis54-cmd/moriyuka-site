const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
const fs = require('fs');

const DIR = __dirname;
const PHOTO = path.join(DIR, 'photo');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(DIR, 'slides-natural.html'));

  // ---- populate uni illustrations ----
  await page.evaluate(() => {
    const lobe = (w, h) =>
      `<span style="display:inline-block;width:${w}px;height:${h}px;border-radius:50%;background:radial-gradient(circle at 38% 30%,#ffd089,#e8862e 68%,#c4651a);box-shadow:inset 0 -6px 12px rgba(150,75,15,.4),0 4px 10px rgba(120,70,20,.18);"></span>`;

    // cover tray: neat grid of lobes
    const grid = document.querySelector('.uni-grid');
    if (grid) {
      grid.style.cssText = 'display:flex;flex-wrap:wrap;gap:16px 18px;width:520px;justify-content:center;align-content:center;padding:24px;';
      grid.innerHTML = Array.from({ length: 15 }, () => lobe(116, 56)).join('');
    }
    // solution macro: few big lobes
    document.querySelectorAll('.uni-macro').forEach((m) => {
      m.style.cssText = 'display:flex;flex-wrap:wrap;gap:20px;width:430px;justify-content:center;';
      m.innerHTML = Array.from({ length: 6 }, () => lobe(180, 92)).join('');
    });
    // problem board: duller lobes (faded, to imply additive look)
    document.querySelectorAll('.dull-uni').forEach((m) => {
      m.style.cssText = 'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:flex;flex-wrap:wrap;gap:14px;width:640px;justify-content:center;filter:saturate(.55) brightness(1.05);opacity:.92;';
      m.innerHTML = Array.from({ length: 12 }, () => lobe(132, 60)).join('');
    });
  });

  // ---- swap in real photos when provided ----
  if (fs.existsSync(PHOTO)) {
    const frames = await page.$$('.photo[data-slot]');
    for (const f of frames) {
      const slot = await f.getAttribute('data-slot');
      const candidates = ['jpg', 'jpeg', 'png', 'webp']
        .map((e) => path.join(PHOTO, String(slot).padStart(2, '0') + '.' + e))
        .filter((p) => fs.existsSync(p));
      if (candidates.length) {
        const data = fs.readFileSync(candidates[0]).toString('base64');
        const ext = candidates[0].split('.').pop();
        await f.evaluate((el, src) => {
          el.classList.add('has-photo');
          el.style.backgroundImage = `url(${src})`;
        }, `data:image/${ext};base64,${data}`);
        console.log('photo applied to slot', slot);
      }
    }
  }

  const slides = await page.$$('.slide');
  for (let i = 0; i < slides.length; i++) {
    const n = String(i + 1).padStart(2, '0');
    await slides[i].screenshot({ path: path.join(DIR, `natural-${n}.png`) });
    console.log('rendered', n);
  }
  await browser.close();
})();
