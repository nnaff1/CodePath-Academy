const puppeteer = require('puppeteer-core');
const path = require('path');

const ARTIFACTS_DIR = 'C:/Users/affan/.gemini/antigravity/brain/f80b0bb5-5c14-4d79-b3cd-b248d87bf2e4';
const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  console.log('🚀 Capturing Sema AI Free Lesson Modal...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    await wait(1000);

    // Open Free Lesson Modal
    console.log('Clicking Try Free Lesson...');
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(
        (el) => el.textContent && el.textContent.includes('Try Free Lesson')
      );
      if (btn) btn.click();
    });
    await wait(1200);

    // Click prompt to chat with Sema AI
    console.log('Sending message to Sema AI...');
    await page.evaluate(() => {
      const promptBtn = Array.from(document.querySelectorAll('button')).find(
        (el) => el.textContent && el.textContent.includes('Why Generics over any?')
      );
      if (promptBtn) promptBtn.click();
    });
    await wait(2000);

    const semaScreenshot = path.join(ARTIFACTS_DIR, 'sema_ai_modal_live.png');
    await page.screenshot({ path: semaScreenshot });
    console.log('📸 Captured sema_ai_modal_live.png');
  } finally {
    await browser.close();
  }
}

run();

