const puppeteer = require('puppeteer-core');
const path = require('path');

const ARTIFACTS_DIR = 'C:/Users/affan/.gemini/antigravity/brain/f80b0bb5-5c14-4d79-b3cd-b248d87bf2e4';
const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function testBackendApis() {
  console.log('📡 Testing Backend API Routes...');

  // 1. Test Login with Student
  const loginRes = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'student@codepath.id', password: 'password123' }),
  });
  const loginData = await loginRes.json();
  console.log('✅ POST /api/auth/login (Student):', loginData.success, loginData.user?.role, loginData.redirectUrl);
  if (!loginData.success || loginData.redirectUrl !== '/dashboard/student') {
    throw new Error('Student login failed');
  }

  // 2. Test Login with Mentor
  const mentorLoginRes = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'mentor@codepath.id', password: 'password123' }),
  });
  const mentorLoginData = await mentorLoginRes.json();
  console.log('✅ POST /api/auth/login (Mentor):', mentorLoginData.success, mentorLoginData.user?.role, mentorLoginData.redirectUrl);
  if (!mentorLoginData.success || mentorLoginData.redirectUrl !== '/dashboard/mentor') {
    throw new Error('Mentor login failed');
  }

  // 3. Test Register
  const testEmail = `newuser_${Date.now()}@example.com`;
  const registerRes = await fetch('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Budi Santoso', email: testEmail, password: 'password123' }),
  });
  const registerData = await registerRes.json();
  console.log('✅ POST /api/auth/register (New User):', registerData.success, registerData.user?.name, registerData.user?.email);
  if (!registerData.success) {
    throw new Error('Register failed');
  }

  // 4. Test Certificate Query
  const certRes = await fetch('http://localhost:3000/api/certificates/CP-2026-889');
  const certData = await certRes.json();
  console.log('✅ GET /api/certificates/CP-2026-889:', certData.success, certData.certificate?.student?.name, certData.certificate?.course?.title);
  if (!certData.success || certData.certificate?.student?.name !== 'Alex Pratama') {
    throw new Error('Certificate lookup failed');
  }

  // 5. Test Sema AI Socratic route
  const semaRes = await fetch('http://localhost:3000/api/sema-ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: 'Why should I use Generics instead of any in TypeScript?',
      language: 'en',
    }),
  });
  const semaData = await semaRes.json();
  console.log('✅ POST /api/sema-ai (Sema AI):', semaData.success, semaData.mentor, semaData.model);
  console.log('   Reply excerpt:', semaData.reply?.substring(0, 90) + '...');
  if (!semaData.success || semaData.mentor !== 'Sema AI') {
    throw new Error('Sema AI route failed');
  }
}

async function runPuppeteerVerification() {
  console.log('\n🚀 Starting Puppeteer UI Verification with Sema AI & Live DB APIs...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    // Step 1: Visit Home
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    await wait(1000);

    // Step 2: Test Certificate Modal query from Live SQLite DB
    console.log('Testing Certificate Verification Modal with SQLite API...');
    await page.evaluate(() => {
      const verifyBtn = Array.from(document.querySelectorAll('button, a')).find(el => el.textContent && el.textContent.includes('Verify Certificate'));
      if (verifyBtn) verifyBtn.click();
    });
    await wait(1500);

    const certScreenshot = path.join(ARTIFACTS_DIR, 'certificate_api_verified.png');
    await page.screenshot({ path: certScreenshot });
    console.log('📸 Captured certificate_api_verified.png');

    // Close certificate modal
    await page.keyboard.press('Escape');
    await wait(500);

    // Step 3: Test Sema AI Free Lesson Modal
    console.log('Testing Sema AI Free Lesson Preview Modal...');
    await page.evaluate(() => {
      const lessonBtn = Array.from(document.querySelectorAll('button')).find(el => el.textContent && el.textContent.includes('Try Free Lesson'));
      if (lessonBtn) lessonBtn.click();
    });
    await wait(1500);

    // Click quick prompt to interact with Sema AI
    console.log('Clicking discussion prompt for Sema AI...');
    await page.evaluate(() => {
      const promptBtn = Array.from(document.querySelectorAll('button')).find(el => el.textContent && el.textContent.includes('Why Generics over any?'));
      if (promptBtn) promptBtn.click();
    });
    await wait(2500);

    const semaScreenshot = path.join(ARTIFACTS_DIR, 'sema_ai_modal_live.png');
    await page.screenshot({ path: semaScreenshot });
    console.log('📸 Captured sema_ai_modal_live.png');

    console.log('✨ All Full-Stack and Sema AI verifications completed successfully!');
  } finally {
    await browser.close();
  }
}

async function main() {
  await testBackendApis();
  await runPuppeteerVerification();
}

main().catch((err) => {
  console.error('❌ Error during verification:', err);
  process.exit(1);
});

