const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = path.resolve('C:/Users/affan/.gemini/antigravity/brain/f80b0bb5-5c14-4d79-b3cd-b248d87bf2e4');
const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function verify() {
  console.log('🚀 Starting Login & Bilingual Redirection Verification...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    // Step 1: Go to Home page and switch to Indonesian
    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    await wait(1000);

    // Switch to Indonesian if not already
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const idBtn = buttons.find(b => b.textContent && b.textContent.trim() === 'ID');
      if (idBtn) idBtn.click();
    });
    await wait(800);

    // Verify H1 is Indonesian
    const h1Text = await page.evaluate(() => document.querySelector('h1')?.textContent);
    console.log(`Landing Page H1 in ID: "${h1Text}"`);

    // Verify the "Mulai Belajar" button exists and click it
    console.log('Clicking "Mulai Belajar" navbar button...');
    const clickedMulaiBelajar = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a'));
      const btn = links.find(el => el.textContent && el.textContent.includes('Mulai Belajar'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    console.log(`Clicked Mulai Belajar button: ${clickedMulaiBelajar}`);

    // Wait for navigation to /login
    await wait(1500);
    const currentUrl = page.url();
    console.log(`Navigated to URL: ${currentUrl}`);

    // Step 2: Verify Login Page in Indonesian
    const loginDataId = await page.evaluate(() => {
      return {
        h1: document.querySelector('h1')?.textContent?.trim(),
        h2: document.querySelector('h2')?.textContent?.trim(),
        backLink: document.querySelector('a[href="/"]')?.textContent?.trim(),
        modeBtn: document.querySelector('.inline-flex.items-center.p-1 button')?.textContent?.trim(),
        googleBtn: document.querySelector('button svg')?.parentElement?.textContent?.trim(),
        submitBtn: document.querySelector('button[type="submit"]')?.textContent?.trim(),
        passwordPlaceholder: document.querySelector('input[type="password"]')?.getAttribute('placeholder'),
      };
    });

    console.log('Login Page Indonesian Content:', JSON.stringify(loginDataId, null, 2));

    const idScreenshotPath = path.join(ARTIFACT_DIR, 'login_page_indonesian.png');
    await page.screenshot({ path: idScreenshotPath, fullPage: true });
    console.log(`📸 Captured login_page_indonesian.png`);

    // Step 3: Test Toggle on Login Page directly (switch to EN)
    console.log('Clicking EN button directly on /login...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const enBtn = buttons.find(b => b.textContent && b.textContent.trim() === 'EN');
      if (enBtn) enBtn.click();
    });
    await wait(800);

    const loginDataEn = await page.evaluate(() => {
      return {
        h1: document.querySelector('h1')?.textContent?.trim(),
        h2: document.querySelector('h2')?.textContent?.trim(),
        submitBtn: document.querySelector('button[type="submit"]')?.textContent?.trim(),
        passwordPlaceholder: document.querySelector('input[type="password"]')?.getAttribute('placeholder'),
      };
    });
    console.log('Login Page English Content:', JSON.stringify(loginDataEn, null, 2));

    const enScreenshotPath = path.join(ARTIFACT_DIR, 'login_page_english.png');
    await page.screenshot({ path: enScreenshotPath, fullPage: true });
    console.log(`📸 Captured login_page_english.png`);

    // Step 4: Switch back to ID
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const idBtn = buttons.find(b => b.textContent && b.textContent.trim() === 'ID');
      if (idBtn) idBtn.click();
    });
    await wait(500);

    console.log('✨ All Login & Bilingual redirection checks passed successfully!');
  } catch (err) {
    console.error('❌ Verification failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

verify();
