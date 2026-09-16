import { Given, When, Then } from '@cucumber/cucumber';
import { page } from '../gov.census.isr.utils/browserSetup';
import { LoginPage } from '../gov.census.isr.pages/loginPage';
import { ConfigReader } from '../gov.census.isr.utils/configReader';

let loginPage: LoginPage;

Given('the respondent is on the 2026 Census Test welcome page', async () => {
  loginPage = new LoginPage(page);
  await loginPage.goto();
});

When('the respondent enters a valid Census ID', async () => {
  await loginPage.censusIdInputBoxLocator.click();
  await loginPage.censusIdInputBoxLocator.pressSequentially(ConfigReader.getValidCensusId());
});

When('the respondent enters an invalid Census ID', async () => {
  await loginPage.censusIdInputBoxLocator.click();
  await loginPage.censusIdInputBoxLocator.pressSequentially(ConfigReader.getInvalidCensusId());
});

When('the respondent clicks the Log In button', async () => {
  const isEnabled = await loginPage.loginButtonLocator.isEnabled();

  if (!isEnabled) {
    throw new Error('The Log In button is not enabled.');
  }

  await loginPage.loginButtonLocator.click();
});

Then('the respondent sees the questionnaire landing page', async () => {
  const isVisible = await loginPage.gqConfirmTextLocator.isVisible();

  if (!isVisible) {
    throw new Error('The questionnaire landing page was not displayed.');
  }
});

Then('the respondent sees a warning validation error', async () => {
  const isVisible = await loginPage.warningLocator.isVisible();

  if (!isVisible) {
    throw new Error('The warning validation error was not displayed.');
  }

  // TODO: verify the exact warning text against the live UAT page, then update .env
  const warningText = await loginPage.warningLocator.textContent();
  const expectedWarning = ConfigReader.getWarningMessage();
  if (!warningText?.includes(expectedWarning)) {
    throw new Error(`Expected warning text to include "${expectedWarning}" but got "${warningText}".`);
  }
});
