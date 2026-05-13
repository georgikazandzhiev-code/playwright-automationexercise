import { getUniqueRegistrationScenario } from '@data-providers/register.data';
import { test } from '../../ui/fixtures';
import { withStepContext } from '@utils/assert-context';

test.describe('Task 1 — User registration', () => {
  test('Registers a new user and shows authenticated session', { tag: '@e2e' }, async ({
    navigationPage,
    signupLoginPage,
    registerAccountPage,
    accountCreatedPage,
    loginPage,
  }) => {
    const data = getUniqueRegistrationScenario();
    await withStepContext('Open home', async () => {
      await navigationPage.gotoPath('/');
    });
    await withStepContext('Navigate to Signup / Login', async () => {
      await navigationPage.goToSignupLogin();
    });
    await withStepContext('Submit new user intake', async () => {
      await signupLoginPage.submitNewUserSignup(data.displayName, data.email);
    });
    await withStepContext('Fill account information', async () => {
      await registerAccountPage.fillAccountInformationAndSubmit(data.account);
    });
    await withStepContext('Verify account created banner', async () => {
      await accountCreatedPage.assertAccountCreatedVisible();
    });
    await withStepContext('Continue into application', async () => {
      await accountCreatedPage.continueToApplication();
    });
    await withStepContext('Verify authenticated banner', async () => {
      await loginPage.assertAuthenticatedSessionVisible();
    });
  });
});
