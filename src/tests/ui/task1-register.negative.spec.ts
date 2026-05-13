import { test } from '../../ui/fixtures';

test.describe('Task 1 — Registration (negative)', () => {
  test('Blocks invalid email on the signup intake form', { tag: '@negative' }, async ({
    navigationPage,
    signupLoginPage,
  }) => {
    await navigationPage.gotoPath('/');
    await navigationPage.goToSignupLogin();
    await signupLoginPage.assertInvalidEmailRejectedOnClient('not-an-email');
  });
});
