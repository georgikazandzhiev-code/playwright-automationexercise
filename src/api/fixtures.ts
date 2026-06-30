import { test as base } from '@playwright/test';
import { ProductsApiService } from './services/products-api.service';

type ApiFixtures = {
  productsApi: ProductsApiService;
};

/**
 * API test fixtures — service layer only; specs must not call `request` directly.
 */
export const test = base.extend<ApiFixtures>({
  productsApi: async ({ request }, use) => {
    await use(new ProductsApiService(request));
  },
});

export { expect } from '@playwright/test';
