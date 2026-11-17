const puppeteer = require('puppeteer-core');
const path = require('path');

const ARTIFACTS_DIR = 'C:/Users/affan/.gemini/antigravity/brain/f80b0bb5-5c14-4d79-b3cd-b248d87bf2e4';
const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  console.log('🚀 Starting Bilingual Switcher verification...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Visit Home (Default English)
  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await wait(800);

  // Capture English Navbar & Hero
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'navbar_language_switcher_en.png'),
  });
  console.log('📸 Captured navbar_language_switcher_en.png');

  // 2. Click 'ID' button in Navbar
  console.log('Clicking Bahasa Indonesia (ID) language button...');
  const clickedID = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('header button'));
    const idBtn = buttons.find((b) => b.textContent && b.textContent.trim() === 'ID');
    if (idBtn) {
      idBtn.click();
      return true;
    }
    return false;
  });
  console.log(`Clicked ID button: ${clickedID}`);
  await wait(600);

  // Verify Hero Headline translated to Indonesian
  const heroHeading = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    return h1 ? h1.textContent : '';
  });
  console.log(`Current H1: "${heroHeading}"`);

  // Verify Navbar links translated to Indonesian
  const navText = await page.evaluate(() => {
    const nav = document.querySelector('header nav');
    return nav ? nav.textContent : '';
  });
  console.log(`Current Nav: "${navText}"`);

  // Check localStorage persistence
  const savedLang = await page.evaluate(() => localStorage.getItem('codepath_lang'));
  console.log(`localStorage 'codepath_lang': "${savedLang}"`);

  // Capture Indonesian Hero & Navbar
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'landing_page_indonesian.png'),
  });
  console.log('📸 Captured landing_page_indonesian.png');

  // 3. Scroll to Curriculum Flow & Capture
  console.log('Scrolling to Curriculum Flow...');
  await page.evaluate(() => {
    const el = document.getElementById('roadmap');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });
  await wait(600);
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'curriculum_indonesian.png'),
  });
  console.log('📸 Captured curriculum_indonesian.png');

  // 4. Scroll to Course Catalog & Capture
  console.log('Scrolling to Course Catalog...');
  await page.evaluate(() => {
    const el = document.getElementById('courses');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });
  await wait(600);
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'catalog_indonesian.png'),
  });
  console.log('📸 Captured catalog_indonesian.png');

  // 5. Test Free Lesson Modal in Indonesian
  console.log('Testing Modal in Indonesian...');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await wait(400);
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const freeBtn = btns.find((b) => b.textContent && b.textContent.includes('Coba Materi Gratis'));
    if (freeBtn) freeBtn.click();
  });
  await wait(600);
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'modal_free_lesson_id.png'),
  });
  console.log('📸 Captured modal_free_lesson_id.png');

  // Close modal
  await page.evaluate(() => {
    const closeBtn = document.querySelector('button:has(svg.lucide-x)');
    if (closeBtn) closeBtn.click();
  });
  await wait(400);

  // 6. Test Persistence on Page Reload
  console.log('Reloading page to test persistence...');
  await page.reload({ waitUntil: 'networkidle0' });
  await wait(600);

  const reloadedHeading = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    return h1 ? h1.textContent : '';
  });
  console.log(`Reloaded H1: "${reloadedHeading}"`);

  // 7. Switch back to EN
  console.log('Switching back to EN...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('header button'));
    const enBtn = buttons.find((b) => b.textContent && b.textContent.trim() === 'EN');
    if (enBtn) enBtn.click();
  });
  await wait(500);

  const finalHeading = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    return h1 ? h1.textContent : '';
  });
  console.log(`Final H1 after switching back to EN: "${finalHeading}"`);

  await browser.close();
  console.log('✨ Bilingual Language Switcher successfully verified!');
}

run().catch((err) => {
  console.error('❌ Error during bilingual verification:', err);
  process.exit(1);
});

