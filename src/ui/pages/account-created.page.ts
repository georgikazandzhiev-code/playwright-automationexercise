import { expect, Locator, Page } from '@playwright/test';
import { ACCOUNT_CREATED_HEADING } from '@utils/constants';
import { resolveSiteOverlays } from '@utils/consent';
import { BasePage } from './base.page';

/**
 * `/account_created` confirmation step.
 */
export class AccountCreatedPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Locators (top) ──
  get successHeading(): Locator {
    return this.page.getByRole('heading', { name: ACCOUNT_CREATED_HEADING, exact: true });
  }

  get continueButton(): Locator {
    return this.page
      .locator('[data-qa="continue-button"]')
      .or(this.page.getByRole('link', { name: 'Continue' }));
  }

  // ── Methods (below) ──
  /**
   * Assert account creation success message is visible.
   */
  assertAccountCreatedVisible = async (): Promise<void> => {
    await expect(this.successHeading).toBeVisible();
  };

  /**
   * Continue into the logged-in experience (typically home with session).
   */
  continueToApplication = async (): Promise<void> => {
    await this.continueButton.click();
    await resolveSiteOverlays(this.page);
  };
}
