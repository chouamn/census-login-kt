import { chromium, Browser, Page } from '@playwright/test';
import { Before, After } from '@cucumber/cucumber';

export let page: Page;
let browser: Browser;

Before(async () => {
  browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  page = await context.newPage();
});

After(async () => {
  await browser.close();
});
