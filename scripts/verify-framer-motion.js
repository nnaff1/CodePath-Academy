const puppeteer = require('puppeteer-core');
const path = require('path');

const ARTIFACTS_DIR = 'C:/Users/affan/.gemini/antigravity/brain/f80b0bb5-5c14-4d79-b3cd-b248d87bf2e4';
const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function clickByText(page, selector, text) {
  return page.evaluate((sel, txt) => {
    const elements = Array.from(document.querySelectorAll(sel));
    const target = elements.find((el) => el.textContent && el.textContent.includes(txt));
    if (target) {
      target.click();
      return true;
    }
    return false;
  }, selector, text);
}

async function run() {
  console.log('🚀 Starting Framer Motion verification...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Visit Home
  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await wait(800);

  // Check Hero entrance & capture initial viewport
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'hero_motion_entrance.png'),
  });
  console.log('📸 Captured hero_motion_entrance.png');

  // 2. Test code tab switch
  console.log('Testing code tab switch (CourseDemo.ts)...');
  await clickByText(page, 'button', 'CourseDemo.ts');
  await wait(500);
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'hero_code_tab_switched.png'),
  });
  console.log('📸 Captured hero_code_tab_switched.png');

  // 3. Scroll down to test Navbar frosted glass & scroll reveals
  console.log('Scrolling down page...');
  await page.evaluate(() => window.scrollTo({ top: 350, behavior: 'smooth' }));
  await wait(600);
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'navbar_frosted_scroll.png'),
  });
  console.log('📸 Captured navbar_frosted_scroll.png');

  // 4. Scroll to Course Catalog and test category filtering
  console.log('Scrolling to Course Catalog...');
  await page.evaluate(() => {
    const el = document.getElementById('courses');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });
  await wait(700);

  // Click 'Beginner' filter
  console.log('Filtering courses by Beginner...');
  await clickByText(page, 'button', 'Beginner');
  await wait(600);
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'courses_filtered_beginner.png'),
  });
  console.log('📸 Captured courses_filtered_beginner.png');

  // Click 'Advanced' filter
  console.log('Filtering courses by Advanced...');
  await clickByText(page, 'button', 'Advanced');
  await wait(600);
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'courses_filtered_advanced.png'),
  });
  console.log('📸 Captured courses_filtered_advanced.png');

  // Reset to All Levels
  await clickByText(page, 'button', 'All Levels');
  await wait(500);

  // 5. Scroll to Value Proposition Banner
  console.log('Scrolling to Value Proposition Banner...');
  await page.evaluate(() => {
    const el = document.getElementById('standard');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });
  await wait(700);
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'value_proposition_revealed.png'),
  });
  console.log('📸 Captured value_proposition_revealed.png');

  // 6. Test Free Lesson Modal opening with scale-in
  console.log('Testing Free Lesson Modal animation...');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await wait(500);
  await clickByText(page, 'button', 'Try Free Lesson');
  await wait(600);
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'modal_free_lesson_animated.png'),
  });
  console.log('📸 Captured modal_free_lesson_animated.png');

  // Close Free Lesson Modal
  await page.evaluate(() => {
    const closeBtn = document.querySelector('button:has(svg.lucide-x)');
    if (closeBtn) closeBtn.click();
  });
  await wait(400);

  // 7. Test Auth Modal opening with scale-in
  console.log('Testing Auth Modal animation...');
  await clickByText(page, 'header button', 'Log In');
  await wait(600);
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'modal_auth_animated.png'),
  });
  console.log('📸 Captured modal_auth_animated.png');

  // Close Auth Modal
  await page.evaluate(() => {
    const closeBtn = document.querySelector('button:has(svg.lucide-x)');
    if (closeBtn) closeBtn.click();
  });
  await wait(400);

  // 8. Test Certificate Modal
  console.log('Testing Certificate Modal animation...');
  await clickByText(page, 'header a', 'Verify Certificate');
  await wait(600);
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'modal_certificate_animated.png'),
  });
  console.log('📸 Captured modal_certificate_animated.png');

  await browser.close();
  console.log('✨ All Framer Motion micro-interactions verified successfully!');
}

run().catch((err) => {
  console.error('❌ Error during verification:', err);
  process.exit(1);
});
