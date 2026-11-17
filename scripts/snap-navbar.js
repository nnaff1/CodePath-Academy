const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACTS_DIR = 'C:\\Users\\affan\\.gemini\\antigravity\\brain\\f80b0bb5-5c14-4d79-b3cd-b248d87bf2e4';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--window-size=1440,900'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  const header = await page.$('header');
  if (header) {
    await header.screenshot({ path: path.join(ARTIFACTS_DIR, 'navbar_clean.png') });
    console.log('Saved navbar_clean.png successfully');
  }
  await browser.close();
}
run();

