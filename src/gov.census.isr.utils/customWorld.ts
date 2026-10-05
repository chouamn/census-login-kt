import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, Page } from '@playwright/test';
import { LoginActions } from '../gov.census.isr.actions/loginActions';

export class CustomWorld extends World {
  browser!: Browser;
  page!: Page;
  loginActions!: LoginActions;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);
