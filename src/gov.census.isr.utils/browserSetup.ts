import { chromium } from '@playwright/test';
import { Before, After } from '@cucumber/cucumber';
import { CustomWorld } from './customWorld';
import { ActionContext } from './actionContext';

Before(async function (this: CustomWorld) {
  this.browser = await chromium.launch({ headless: false });
  const context = await this.browser.newContext();
  this.page = await context.newPage();
  this.actions = new ActionContext(this.page);
});

After(async function (this: CustomWorld) {
  if (this.browser) {
    await this.browser.close();
  }
});
