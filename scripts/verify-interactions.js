const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACTS_DIR = 'C:\\Users\\affan\\.gemini\\antigravity\\brain\\f80b0bb5-5c14-4d79-b3cd-b248d87bf2e4';
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  console.log('Launching browser with puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--window-size=1440,900'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // 1. Capture Hero Free Lesson Modal
  console.log('Testing "Try Free Lesson" modal...');
  const buttons1 = await page.$$('button');
  for (const b of buttons1) {
    const text = await page.evaluate((el) => el.textContent, b);
    if (text.includes('Try Free Lesson')) {
      await b.click();
      break;
    }
  }

  await wait(800);
  const ssPath1 = path.join(ARTIFACTS_DIR, 'modal_free_lesson.png');
  await page.screenshot({ path: ssPath1 });
  console.log('Saved modal_free_lesson.png');

  // Close modal with Escape key
  await page.keyboard.press('Escape');
  // Or click close button
  const closeBtns1 = await page.$$('button');
  for (const b of closeBtns1) {
    const isClose = await page.evaluate((el) => el.querySelector('svg.lucide-x') !== null, b);
    if (isClose) {
      await b.click();
      break;
    }
  }
  await wait(500);

  // 2. Capture Enrollment Modal
  console.log('Testing "Enroll Now" modal...');
  const buttons2 = await page.$$('button');
  for (const b of buttons2) {
    const text = await page.evaluate((el) => el.textContent, b);
    if (text.includes('Enroll Now')) {
      await b.click();
      break;
    }
  }
  await wait(800);
  const ssPath2 = path.join(ARTIFACTS_DIR, 'modal_enrollment.png');
  await page.screenshot({ path: ssPath2 });
  console.log('Saved modal_enrollment.png');

  // Close enrollment modal
  const closeBtns2 = await page.$$('button');
  for (const b of closeBtns2) {
    const isClose = await page.evaluate((el) => el.querySelector('svg.lucide-x') !== null, b);
    if (isClose) {
      await b.click();
      break;
    }
  }
  await wait(500);

  // 3. Test Certificate Check Modal from footer
  console.log('Testing "Verify Credential" modal...');
  const buttons3 = await page.$$('button');
  for (const b of buttons3) {
    const text = await page.evaluate((el) => el.textContent, b);
    if (text.trim() === 'CHECK') {
      await b.click();
      break;
    }
  }
  await wait(800);
  const ssPath3 = path.join(ARTIFACTS_DIR, 'modal_certificate.png');
  await page.screenshot({ path: ssPath3 });
  console.log('Saved modal_certificate.png');

  const closeBtns3 = await page.$$('button');
  for (const b of closeBtns3) {
    const isClose = await page.evaluate((el) => el.querySelector('svg.lucide-x') !== null, b);
    if (isClose) {
      await b.click();
      break;
    }
  }
  await wait(500);

  // 4. Test Auth Modal
  console.log('Testing "Log In" modal...');
  const buttons4 = await page.$$('button');
  for (const b of buttons4) {
    const text = await page.evaluate((el) => el.textContent, b);
    if (text.trim() === 'Log In') {
      await b.click();
      break;
    }
  }
  await wait(800);
  const ssPath4 = path.join(ARTIFACTS_DIR, 'modal_auth.png');
  await page.screenshot({ path: ssPath4 });
  console.log('Saved modal_auth.png');

  await browser.close();
  console.log('All verification snapshots completed successfully!');
}

run().catch((err) => {
  console.error('Error running verification script:', err);
  process.exit(1);
});
