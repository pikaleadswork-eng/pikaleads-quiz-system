import puppeteer from 'puppeteer';

const viewports = [
  { name: 'Mobile-375', width: 375, height: 812 },
  { name: 'Mobile-414', width: 414, height: 896 },
  { name: 'Tablet-768', width: 768, height: 1024 },
  { name: 'Tablet-1024', width: 1024, height: 768 },
  { name: 'Desktop-1920', width: 1920, height: 1080 }
];

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });

for (const vp of viewports) {
  const page = await browser.newPage();
  await page.setViewport({ width: vp.width, height: vp.height });
  
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 15000 });
    await page.screenshot({ path: `/tmp/screenshot-${vp.name}.png`, fullPage: true });
    console.log(`✓ ${vp.name}: ${vp.width}x${vp.height}`);
  } catch (e) {
    console.log(`✗ ${vp.name}: ${e.message}`);
  }
  
  await page.close();
}

await browser.close();
console.log('\nScreenshots saved to /tmp/');
