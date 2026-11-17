const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACTS_DIR = 'C:\\Users\\affan\\.gemini\\antigravity\\brain\\f80b0bb5-5c14-4d79-b3cd-b248d87bf2e4';
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--window-size=1440,900'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Log In Mode
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
  await wait(500);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'login_inputs_empty_placeholder.png') });
  console.log('Saved login_inputs_empty_placeholder.png');

  // 2. Register Mode
  const buttons = await page.$$('button');
  for (const b of buttons) {
    const text = await page.evaluate((el) => el.textContent, b);
    if (text.includes('Create Free Account')) {
      await b.click();
      break;
    }
  }
  await wait(500);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'register_inputs_empty_placeholder.png') });
  console.log('Saved register_inputs_empty_placeholder.png');

  await browser.close();
}
run();

