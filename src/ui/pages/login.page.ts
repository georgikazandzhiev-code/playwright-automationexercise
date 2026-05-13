import { expect, Locator, Page } from '@playwright/test';
import { LOGIN_ERROR_INCORRECT } from '@utils/constants';
import { BasePage } from './base.page';

/**
 * Login form on `/login`.
 */
export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Locators (top) ──
  get emailInput(): Locator {
    return this.page.locator('[data-qa="login-email"]');
  }

  get passwordInput(): Locator {
    return this.page.locator('[data-qa="login-password"]');
  }

  get loginButton(): Locator {
    return this.page.locator('[data-qa="login-button"]');
  }

  get loginErrorParagraph(): Locator {
    return this.page.getByText(LOGIN_ERROR_INCORRECT);
  }

  // ── Methods (below) ──
  /**
   * Perform login with provided credentials.
   * @param email - Registered user email.
   * @param password - Account password.
   */
  loginWithCredentials = async (email: string, password: string): Promise<void> => {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.settleOverlaysAfterAction();
  };

  /**
   * Assert logged-in banner shows expected display name.
   * @param displayName - Name portion shown after "Logged in as".
   */
  assertLoggedInAs = async (displayName: string): Promise<void> => {
    const banner = this.page.getByText(new RegExp(`Logged in as\\s+${escapeRegExp(displayName)}`, 'i'));
    await expect(banner).toBeVisible();
  };

  /**
   * Assert any authenticated banner is visible (when exact display text is unknown).
   */
  assertAuthenticatedSessionVisible = async (): Promise<void> => {
    await expect(this.page.getByText(/Logged in as/i)).toBeVisible();
  };

  /**
   * Assert incorrect credentials message is shown.
   */
  assertLoginErrorVisible = async (): Promise<void> => {
    await expect(this.loginErrorParagraph).toBeVisible();
  };
}

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
