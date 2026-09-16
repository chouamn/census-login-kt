import { Page, Locator } from '@playwright/test';
import { ConfigReader } from '../gov.census.isr.utils/configReader';

export class LoginPage {
  readonly page: Page;
  readonly censusIdInputBoxLocator: Locator;
  readonly loginButtonLocator: Locator;
  readonly gqConfirmTextLocator: Locator;
  readonly warningLocator: Locator;

  constructor(page: Page) {
    this.page = page;
    // NOTE: 'authCodeInput' is treated as the field's accessible name — verify against the DOM;
    // page.getByLabel('Census ID (12-digit)') may be more reliable.
    this.censusIdInputBoxLocator = page.getByRole('textbox', { name: 'authCodeInput' });
    this.loginButtonLocator = page.locator('[aria-label="auth submit button"]');
    this.gqConfirmTextLocator = page.locator('#component54'); // verify: #id vs .class vs testid
    this.warningLocator = page.getByRole('alert'); // added so the invalid-ID scenario can assert
  }

  async goto(): Promise<void> {
    await this.page.goto(ConfigReader.getBaseUrl());
  }
}
