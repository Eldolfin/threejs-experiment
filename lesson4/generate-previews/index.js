import puppeteer from 'puppeteer';

const pages = ['first', 'second', 'haunted-house'];

(async () => {
  // 1. Launch the browser
  const browser = await puppeteer.launch();

  // 2. Open a new page
  const page = await browser.newPage();

  for (const pageName of pages) {
    // 3. Navigate to URL
    await page.goto(`http://localhost:3000/${pageName}/`);
    // 4. Take Screenshot
    await page.screenshot({ path: `./${pageName}.png` });
  }

  await browser.close();
})();
