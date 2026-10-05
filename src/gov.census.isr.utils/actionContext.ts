import { Page } from '@playwright/test';
import { LoginActions } from '../gov.census.isr.actions/loginActions';

export class ActionContext {
  login: LoginActions;

  constructor(page: Page) {
    this.login = new LoginActions(page);
  }
}
