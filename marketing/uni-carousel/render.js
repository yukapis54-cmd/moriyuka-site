const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, 'slides.html'));

  // draw radiating spikes for the uni illustration on the cover
  await page.evaluate(() => {
    const g = document.querySelector('.slide svg g g[fill="#3a1f12"]');
    if (!g) return;
    const cx = 100, cy = 100;
    let s = '';
    for (let i = 0; i < 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      const r1 = 58, r2 = 58 + (i % 2 ? 30 : 22);
      const x1 = cx + Math.cos(a) * r1, y1 = cy + Math.sin(a) * r1;
      const x2 = cx + Math.cos(a) * r2, y2 = cy + Math.sin(a) * r2;
      const w = i % 2 ? 3.2 : 2.2;
      s += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#5a2f17" stroke-width="${w}" stroke-linecap="round"/>`;
    }
    g.innerHTML = s;
  });

  const slides = await page.$$('.slide');
  for (let i = 0; i < slides.length; i++) {
    const n = String(i + 1).padStart(2, '0');
    await slides[i].screenshot({ path: path.join(__dirname, `uni-carousel-${n}.png`) });
    console.log('rendered slide', n);
  }
  await browser.close();
})();
