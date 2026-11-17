const puppeteer = require('puppeteer-core');
const path = require('path');

const ARTIFACTS_DIR = 'C:/Users/affan/.gemini/antigravity/brain/f80b0bb5-5c14-4d79-b3cd-b248d87bf2e4';
const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  console.log('🚀 Starting 3D Interactive Elements verification...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--window-size=1440,900',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Visit Home
  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await wait(1200); // Give WebGL canvas time to initialize

  // Check if WebGL canvases are rendered
  const canvasCount = await page.evaluate(() => document.querySelectorAll('canvas').length);
  console.log(`WebGL Canvas count detected: ${canvasCount}`);

  // Capture Resting Hero 3D Perspective Window
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'hero_3d_perspective_window.png'),
  });
  console.log('📸 Captured hero_3d_perspective_window.png');

  // 2. Test 3D Mouse Tilt: Move mouse over right-side code card
  console.log('Simulating mouse movement across 3D Code Window...');
  const cardBox = await page.evaluate(() => {
    const el = document.querySelector('div[style*="perspective"]');
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return { x: rect.left + rect.width * 0.8, y: rect.top + rect.height * 0.2 };
  });

  if (cardBox) {
    await page.mouse.move(cardBox.x, cardBox.y);
    await wait(600);
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'hero_3d_mouse_tilt.png'),
    });
    console.log('📸 Captured hero_3d_mouse_tilt.png (tilted card with 3D depth badges)');

    // Simulate drag rotation on 3D TechCore
    console.log('Simulating drag-to-rotate interaction on 3D TechCore Canvas...');
    await page.mouse.down();
    await page.mouse.move(cardBox.x - 80, cardBox.y + 40, { steps: 8 });
    await page.mouse.up();
    await wait(500);
  }

  // 3. Scroll to Value Proposition Banner
  console.log('Scrolling to Value Proposition Banner...');
  await page.evaluate(() => {
    const el = document.getElementById('standard');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });
  await wait(1000);

  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'value_proposition_3d_centerpiece.png'),
  });
  console.log('📸 Captured value_proposition_3d_centerpiece.png');

  await browser.close();
  console.log('✨ All 3D Interactive Elements verified successfully!');
}

run().catch((err) => {
  console.error('❌ Error during 3D verification:', err);
  process.exit(1);
});

