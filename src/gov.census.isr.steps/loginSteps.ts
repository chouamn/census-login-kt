import { Given, When, Then } from '@cucumber/cucumber';
import { LoginPage } from '../gov.census.isr.pages/loginPage';
import { ConfigReader } from '../gov.census.isr.utils/configReader';
import { CustomWorld } from '../gov.census.isr.utils/customWorld';

Given('the respondent is on the 2026 Census Test welcome page', async function (this: CustomWorld) {
  this.loginPage = new LoginPage(this.page);
  await this.loginPage.goto();
});

When('the respondent enters a valid Census ID', async function (this: CustomWorld) {
  await this.loginPage.enterCensusId(ConfigReader.getValidCensusId());
});

When('the respondent enters an invalid Census ID', async function (this: CustomWorld) {
  await this.loginPage.enterCensusId(ConfigReader.getInvalidCensusId());
});

When('the respondent clicks the Log In button', async function (this: CustomWorld) {
  await this.loginPage.clickLogin();
});

Then('the respondent sees the questionnaire landing page', async function (this: CustomWorld) {
  await this.loginPage.assertQuestionnaireLandingVisible();
});

Then('the respondent sees a warning validation error', async function (this: CustomWorld) {
  // TODO: verify the exact warning text against the live UAT page, then update .env.uat
  await this.loginPage.assertWarningVisible();
  await this.loginPage.assertWarningMessage(ConfigReader.getWarningMessage());
});
