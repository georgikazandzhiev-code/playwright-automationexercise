import { request as apiRequest, type APIRequestContext } from '@playwright/test';
import {
  buildSeededAccount,
  type SeededAccount,
} from '../../api/data-providers/account-api.data';
import { AccountApiService } from '../../api/services/account-api.service';
import { DEFAULT_BASE_URL, WRONG_PASSWORD_PLACEHOLDER } from '@utils/constants';
import { test } from '../../ui/fixtures';
import { withStepContext } from '@utils/assert-context';

const baseURL = process.env.BASE_URL ?? DEFAULT_BASE_URL;

test.describe('Task 3 — Login and logout', () => {
  let apiContext: APIRequestContext;
  let account: SeededAccount;

  // Seed a known-credentialed user via the API so the positive path ALWAYS runs
  // (no test.skip / false green) and is cleaned up afterwards.
  test.beforeAll(async () => {
    apiContext = await apiRequest.newContext({ baseURL });
    account = buildSeededAccount();
    await new AccountApiService(apiContext).seedAccount(account.payload);
  });

  test.afterAll(async () => {
    await new AccountApiService(apiContext).removeAccount(account.email, account.password);
    await apiContext.dispose();
  });

  test(
    'Logs in with a seeded account and logs out cleanly',
    { tag: '@e2e' },
    async ({ navigationPage, loginPage }) => {
      await withStepContext('Open Signup / Login', async () => {
        await navigationPage.gotoPath('/');
        await navigationPage.goToSignupLogin();
      });
      await withStepContext('Authenticate', async () => {
        await loginPage.loginWithCredentials(account.email, account.password);
      });
      await withStepContext('Verify authenticated session', async () => {
        await loginPage.assertAuthenticatedSessionVisible();
      });
      await withStepContext('Logout', async () => {
        await navigationPage.logout();
      });
      await withStepContext('Verify logged-out chrome', async () => {
        await navigationPage.assertSignupLoginVisible();
      });
    },
  );

  test(
    'Shows error for unknown email with wrong password',
    { tag: '@negative' },
    async ({ navigationPage, loginPage }) => {
      await navigationPage.gotoPath('/');
      await navigationPage.goToSignupLogin();
      await loginPage.loginWithCredentials(
        `ghost_${Date.now()}@example.com`,
        WRONG_PASSWORD_PLACEHOLDER,
      );
      await loginPage.assertLoginErrorVisible();
    },
  );
});
