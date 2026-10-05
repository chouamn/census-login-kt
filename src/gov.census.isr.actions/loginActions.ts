import { Page } from '@playwright/test';
import { LoginPage } from '../gov.census.isr.pages/loginPage';
import { ConfigReader } from '../gov.census.isr.utils/configReader';

export class LoginActions {
  private readonly loginPage: LoginPage;

  constructor(page: Page) {
    this.loginPage = new LoginPage(page);
  }

  async openLoginPage(): Promise<void> {
    await this.loginPage.goto();
  }

  async enterValidCensusId(): Promise<void> {
    await this.loginPage.enterCensusId(ConfigReader.getValidCensusId());
  }

  async enterInvalidCensusId(): Promise<void> {
    await this.loginPage.enterCensusId(ConfigReader.getInvalidCensusId());
  }

  async submitLogin(): Promise<void> {
    await this.loginPage.clickLogin();
  }

  async verifyLoginSuccess(): Promise<void> {
    await this.loginPage.assertQuestionnaireLandingVisible();
  }

  async verifyValidationWarning(): Promise<void> {
    await this.loginPage.assertWarningVisible();
    await this.loginPage.assertWarningMessage(ConfigReader.getWarningMessage());
  }
}
