import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * `/login` — "New User Signup!" first step (name + email).
 */
export class SignupLoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Locators (top) ── (testIdAttribute = data-qa)
  get signupNameInput(): Locator {
    return this.page.getByTestId('signup-name');
  }

  get signupEmailInput(): Locator {
    return this.page.getByTestId('signup-email');
  }

  get signupButton(): Locator {
    return this.page.getByTestId('signup-button');
  }

  // ── Methods (below) ──
  /**
   * Fill first registration step and proceed to account details form.
   * @param name - Visible account name.
   * @param email - Unique email address.
   */
  submitNewUserSignup = async (name: string, email: string): Promise<void> => {
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupButton.click();
    await this.settleOverlaysAfterAction();
  };

  /**
   * Assert browser blocked invalid email (HTML5) or we remain on login route.
   * @param email - Invalid value typed into email field.
   */
  assertInvalidEmailRejectedOnClient = async (email: string): Promise<void> => {
    await this.signupNameInput.fill('Negative Test User');
    await this.signupEmailInput.fill(email);
    const validity = await this.signupEmailInput.evaluate<boolean>(
      (el: HTMLElement | SVGElement) => (el as HTMLInputElement).validity.valid,
    );
    expect(validity, 'Expected invalid email to fail HTML5 validation').toBe(false);
  };
}
