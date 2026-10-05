import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, Page } from '@playwright/test';
import { ActionContext } from './actionContext';

export class CustomWorld extends World {
  browser!: Browser;
  page!: Page;
  actions!: ActionContext;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);
