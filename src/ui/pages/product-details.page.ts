import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export type ProductSummary = {
  name: string;
  price: string;
};

/**
 * `/product_details/*` detail view (name, price, add to cart).
 */
export class ProductDetailsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Locators (top) ──
  get productTitle(): Locator {
    return this.page.locator('.product-information h2');
  }

  /** Single price line only (avoid a broad `p`/`span` that also includes Quantity / Add to cart). */
  get priceLabel(): Locator {
    return this.page
      .locator('.product-information')
      .getByText(/^Rs\.\s*[\d,.]+\s*$/i)
      .first();
  }

  get addToCartButton(): Locator {
    return this.page
      .getByRole('button', { name: /Add to cart/i })
      .or(this.page.locator('button.btn.btn-default.cart'));
  }

  get continueShoppingButton(): Locator {
    return this.page.getByRole('button', { name: 'Continue Shopping' });
  }

  // ── Methods (below) ──
  /**
   * Read visible product title and price line from the detail page.
   */
  readProductSummary = async (): Promise<ProductSummary> => {
    const name = (await this.productTitle.innerText()).trim();
    const price = (await this.priceLabel.first().innerText()).trim();
    return { name, price };
  };

  /**
   * Add the opened product to the cart and dismiss the confirmation modal.
   */
  addToCartAndContinueShopping = async (): Promise<void> => {
    await expect(this.addToCartButton).toBeVisible();
    await this.addToCartButton.click();
    await this.settleOverlaysAfterAction();
    await expect(this.continueShoppingButton).toBeVisible();
    await this.continueShoppingButton.click();
    await this.settleOverlaysAfterAction();
  };
}
