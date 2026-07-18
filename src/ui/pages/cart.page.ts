import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * `/view_cart` — line items and totals.
 */
export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Locators (top) ──
  get cartTable(): Locator {
    return this.page.locator('#cart_info_table');
  }

  // The cart "Proceed To Checkout" is an <a> without href, so it has no link role — match by text.
  get proceedToCheckoutButton(): Locator {
    return this.page.getByText('Proceed To Checkout');
  }

  // ── Methods (below) ──
  /**
   * Proceed from the cart to the checkout page (logged-in user goes straight through).
   */
  proceedToCheckout = async (): Promise<void> => {
    await this.proceedToCheckoutButton.click();
    await this.settleOverlaysAfterAction();
  };

  /**
   * Locate a cart row by product display name.
   * @param productName - Visible product title in the cart table.
   */
  private rowByProductName = (productName: string): Locator => {
    return this.cartTable.locator('tbody tr').filter({ hasText: productName });
  };

  /**
   * Assert product name, unit price text, and quantity appear in the cart row.
   * @param productName - Product title as shown in cart.
   * @param priceSnippet - Price fragment (e.g. contains Rs.).
   * @param quantity - Expected quantity label/button text.
   */
  assertLineItemMatches = async (
    productName: string,
    priceSnippet: string,
    quantity: string,
  ): Promise<void> => {
    const row = this.rowByProductName(productName);
    await expect(row).toBeVisible();
    await expect(row).toContainText(priceSnippet);
    await expect(
      row.locator('td.cart_quantity').getByRole('button', { name: quantity }),
    ).toBeVisible();
  };
}
