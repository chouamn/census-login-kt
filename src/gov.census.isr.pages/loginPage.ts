import { Page, Locator } from '@playwright/test';
import { ConfigReader } from '../gov.census.isr.utils/configReader';

export class LoginPage {
  readonly page: Page;
  private readonly censusIdInputBoxLocator: Locator;
  private readonly loginButtonLocator: Locator;
  private readonly gqConfirmTextLocator: Locator;
  private readonly warningLocator: Locator;

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

  async enterCensusId(censusId: string): Promise<void> {
    await this.censusIdInputBoxLocator.click();
    await this.censusIdInputBoxLocator.pressSequentially(censusId);
  }

  async clickLogin(): Promise<void> {
    const isEnabled = await this.loginButtonLocator.isEnabled();

    if (!isEnabled) {
      throw new Error('The Log In button is not enabled.');
    }

    await this.loginButtonLocator.click();
  }

  async assertQuestionnaireLandingVisible(): Promise<void> {
    const isVisible = await this.gqConfirmTextLocator.isVisible();

    if (!isVisible) {
      throw new Error('The questionnaire landing page was not displayed.');
    }
  }

  async assertWarningVisible(): Promise<void> {
    const isVisible = await this.warningLocator.isVisible();

    if (!isVisible) {
      throw new Error('The warning validation error was not displayed.');
    }
  }

  async assertWarningMessage(expectedMessage: string): Promise<void> {
    const warningText = await this.warningLocator.textContent();

    if (!warningText?.includes(expectedMessage)) {
      throw new Error(`Expected warning text to include "${expectedMessage}" but got "${warningText}".`);
    }
  }
}
