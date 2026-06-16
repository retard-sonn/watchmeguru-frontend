import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));

  console.log('Navigating to landing...');
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000);
  
  const mascot = await page.$('.cursor-pointer.group');
  if (mascot) {
    console.log('Clicking landing mascot...');
    await mascot.click();
    await page.waitForTimeout(150); // Frame where fangs might appear
    await page.screenshot({ path: 'mascot_click_landing_150ms.png' });
    await page.waitForTimeout(150); 
    await page.screenshot({ path: 'mascot_click_landing_300ms.png' });
  }

  console.log('Navigating to dashboard...');
  await page.goto('http://localhost:3000/dashboard');
  await page.waitForTimeout(2000);
  
  const dashboardMascot = await page.$('.cursor-pointer.select-none');
  if (dashboardMascot) {
    console.log('Clicking dashboard mascot...');
    await dashboardMascot.click();
    await page.waitForTimeout(150);
    await page.screenshot({ path: 'mascot_click_dashboard_150ms.png' });
    await page.waitForTimeout(150);
    await page.screenshot({ path: 'mascot_click_dashboard_300ms.png' });
  }

  await browser.close();
  console.log('Done.');
})();