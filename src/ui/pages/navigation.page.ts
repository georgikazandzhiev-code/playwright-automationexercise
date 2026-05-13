import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Top navigation for Automation Exercise.
 */
export class NavigationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Locators (top) ──
  get signupLoginLink(): Locator {
    return this.page.getByRole('link', { name: 'Signup / Login' });
  }

  get logoutLink(): Locator {
    return this.page.getByRole('link', { name: 'Logout' });
  }

  get productsLink(): Locator {
    return this.page.getByRole('link', { name: 'Products' });
  }

  get cartLink(): Locator {
    return this.page.getByRole('link', { name: 'Cart' });
  }

  get homeLogoLink(): Locator {
    return this.page.locator('a[href="/"]').first();
  }

  // ── Methods (below) ──
  /**
   * Open home page from header logo.
   */
  goToHome = async (): Promise<void> => {
    await this.gotoPath('/');
  };

  /**
   * Open Signup / Login page.
   */
  goToSignupLogin = async (): Promise<void> => {
    await this.signupLoginLink.click();
    await this.settleOverlaysAfterAction();
  };

  /**
   * Open products listing.
   */
  goToProducts = async (): Promise<void> => {
    await this.productsLink.click();
    await this.settleOverlaysAfterAction();
  };

  /**
   * Open shopping cart.
   * Uses direct navigation because header "Cart" clicks are often blocked by ad
   * interstitials on this practice site; the line-item assertions still cover cart UX.
   */
  goToCart = async (): Promise<void> => {
    await this.gotoPath('/view_cart');
  };

  /**
   * Log out current session.
   */
  logout = async (): Promise<void> => {
    await this.logoutLink.click();
    await this.settleOverlaysAfterAction();
  };

  /**
   * Assert Signup / Login link is visible (logged-out header).
   */
  assertSignupLoginVisible = async (): Promise<void> => {
    await expect(this.signupLoginLink).toBeVisible();
  };

  /**
   * Assert Logout control is visible (logged-in header).
   */
  assertLogoutVisible = async (): Promise<void> => {
    await expect(this.logoutLink).toBeVisible();
  };
}
