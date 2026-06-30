import { getExistingUserCredentials } from '@data-providers/login.data';
import { WRONG_PASSWORD_PLACEHOLDER } from '@utils/constants';
import { test } from '../../ui/fixtures';
import { withStepContext } from '@utils/assert-context';

test.describe('Task 3 — Login and logout', () => {
  test(
    'Logs in with stored credentials and logs out cleanly',
    { tag: '@e2e' },
    async ({ navigationPage, loginPage }) => {
      test.skip(
        !process.env.TEST_USER_EMAIL || !process.env.TEST_USER_PASSWORD,
        'Set TEST_USER_EMAIL and TEST_USER_PASSWORD in .env for this positive path.',
      );
      const creds = getExistingUserCredentials();
      await withStepContext('Open Signup / Login', async () => {
        await navigationPage.gotoPath('/');
        await navigationPage.goToSignupLogin();
      });
      await withStepContext('Authenticate', async () => {
        await loginPage.loginWithCredentials(creds.email, creds.password);
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
