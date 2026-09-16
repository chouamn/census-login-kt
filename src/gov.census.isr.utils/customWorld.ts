import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, Page } from '@playwright/test';
import { LoginPage } from '../gov.census.isr.pages/loginPage';

export class CustomWorld extends World {
  browser!: Browser;
  page!: Page;
  loginPage!: LoginPage;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);
