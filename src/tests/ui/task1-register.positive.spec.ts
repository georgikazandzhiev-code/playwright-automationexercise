import { request as apiRequest, type APIRequestContext } from '@playwright/test';
import { AccountApiService } from '../../api/services/account-api.service';
import { getUniqueRegistrationScenario } from '@data-providers/register.data';
import { DEFAULT_BASE_URL } from '@utils/constants';
import { test } from '../../ui/fixtures';
import { withStepContext } from '@utils/assert-context';

const baseURL = process.env.BASE_URL ?? DEFAULT_BASE_URL;

test.describe('Task 1 — User registration', () => {
  // Credentials of the account created by the running test, for teardown.
  let created: { email: string; password: string } | null = null;

  // Leave the environment as found — delete the user we registered (best-effort).
  test.afterEach(async () => {
    if (!created) {
      return;
    }
    const ctx: APIRequestContext = await apiRequest.newContext({ baseURL });
    try {
      await new AccountApiService(ctx).deleteAccount(created.email, created.password);
    } finally {
      await ctx.dispose();
      created = null;
    }
  });

  test(
    'Registers a new user and shows authenticated session',
    { tag: '@e2e' },
    async ({
      navigationPage,
      signupLoginPage,
      registerAccountPage,
      accountCreatedPage,
      loginPage,
    }) => {
      const data = getUniqueRegistrationScenario();
      created = { email: data.email, password: data.password };
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
    },
  );
});
