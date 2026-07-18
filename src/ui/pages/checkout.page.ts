import { expect, Locator, Page } from '@playwright/test';
import type { SeededAccount } from '../../api/data-providers/account-api.data';
import { BasePage } from './base.page';

/**
 * `/checkout` — address review + order comment before payment.
 */
export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Locators (top) ──
  // Address blocks have stable structural ids and no semantic/testid hook — last resort.
  get deliveryAddressBlock(): Locator {
    return this.page.locator('#address_delivery');
  }

  get billingAddressBlock(): Locator {
    return this.page.locator('#address_invoice');
  }

  get orderCommentTextarea(): Locator {
    return this.page.locator('textarea[name="message"]');
  }

  get placeOrderLink(): Locator {
    return this.page.getByRole('link', { name: 'Place Order' });
  }

  // ── Methods (below) ──
  /**
   * Assert the delivery address shows the user's registered details.
   * @param account - The seeded account whose address should appear at checkout.
   */
  assertDeliveryAddressMatches = async (account: SeededAccount): Promise<void> => {
    const block = this.deliveryAddressBlock;
    await expect(block).toBeVisible();
    await expect(block).toContainText(account.firstName);
    await expect(block).toContainText(account.lastName);
    await expect(block).toContainText(account.address1);
    await expect(block).toContainText(account.city);
    await expect(block).toContainText(account.zip);
    await expect(block).toContainText(account.country);
  };

  /**
   * Enter the order comment.
   * @param comment - Free-text note for the order.
   */
  addOrderComment = async (comment: string): Promise<void> => {
    await this.orderCommentTextarea.fill(comment);
  };

  /**
   * Proceed from checkout to the payment page.
   */
  placeOrder = async (): Promise<void> => {
    await this.placeOrderLink.click();
    await this.settleOverlaysAfterAction();
  };
}
