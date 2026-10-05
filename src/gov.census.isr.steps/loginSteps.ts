import { Given, When, Then } from '@cucumber/cucumber';
import { LoginActions } from '../gov.census.isr.actions/loginActions';
import { CustomWorld } from '../gov.census.isr.utils/customWorld';

Given('the respondent is on the 2026 Census Test welcome page', async function (this: CustomWorld) {
  this.loginActions = new LoginActions(this.page);
  await this.loginActions.openLoginPage();
});

When('the respondent enters a valid Census ID', async function (this: CustomWorld) {
  await this.loginActions.enterValidCensusId();
});

When('the respondent enters an invalid Census ID', async function (this: CustomWorld) {
  await this.loginActions.enterInvalidCensusId();
});

When('the respondent clicks the Log In button', async function (this: CustomWorld) {
  await this.loginActions.submitLogin();
});

Then('the respondent sees the questionnaire landing page', async function (this: CustomWorld) {
  await this.loginActions.verifyLoginSuccess();
});

Then('the respondent sees a warning validation error', async function (this: CustomWorld) {
  // TODO: verify the exact warning text against the live UAT page, then update .env.uat
  await this.loginActions.verifyValidationWarning();
});
