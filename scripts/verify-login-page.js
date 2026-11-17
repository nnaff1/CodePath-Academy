const puppeteer = require('puppeteer-core');
const path = require('path');

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

  // 1. Capture Login Page (Default Log In Mode)
  console.log('Navigating to http://localhost:3000/login ...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
  await wait(600);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'login_page_desktop.png') });
  console.log('Saved login_page_desktop.png');

  // 2. Switch to Register Mode
  console.log('Switching to Create Free Account mode...');
  const buttons = await page.$$('button');
  for (const b of buttons) {
    const text = await page.evaluate((el) => el.textContent, b);
    if (text.includes('Create Free Account')) {
      await b.click();
      break;
    }
  }
  await wait(600);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'register_page_desktop.png') });
  console.log('Saved register_page_desktop.png');

  // 3. Test Student Dashboard
  console.log('Navigating to /dashboard/student ...');
  await page.goto('http://localhost:3000/dashboard/student', { waitUntil: 'networkidle0' });
  await wait(600);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'dashboard_student.png') });
  console.log('Saved dashboard_student.png');

  // 4. Test Mentor Dashboard
  console.log('Navigating to /dashboard/mentor ...');
  await page.goto('http://localhost:3000/dashboard/mentor', { waitUntil: 'networkidle0' });
  await wait(600);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'dashboard_mentor.png') });
  console.log('Saved dashboard_mentor.png');

  // 5. Test Super Admin Dashboard
  console.log('Navigating to /dashboard/super-admin ...');
  await page.goto('http://localhost:3000/dashboard/super-admin', { waitUntil: 'networkidle0' });
  await wait(600);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'dashboard_super_admin.png') });
  console.log('Saved dashboard_super_admin.png');

  // 6. Test Mobile View for /login
  console.log('Testing mobile viewport on /login ...');
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
  await wait(600);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'login_page_mobile.png') });
  console.log('Saved login_page_mobile.png');

  await browser.close();
  console.log('All login & dashboard captures completed successfully!');
}

run().catch((err) => {
  console.error('Error running login capture script:', err);
  process.exit(1);
});

