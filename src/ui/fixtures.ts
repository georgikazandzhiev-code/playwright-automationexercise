import { test as base } from '@playwright/test';
import {
  blockThirdPartyAdRoutes,
  installConsentHandler,
  installVignetteCloseHandler,
} from '@utils/consent';
import { AccountCreatedPage } from './pages/account-created.page';
import { CartPage } from './pages/cart.page';
import { CheckoutPage } from './pages/checkout.page';
import { LoginPage } from './pages/login.page';
import { NavigationPage } from './pages/navigation.page';
import { PaymentPage } from './pages/payment.page';
import { ProductDetailsPage } from './pages/product-details.page';
import { ProductsPage } from './pages/products.page';
import { RegisterAccountPage } from './pages/register-account.page';
import { SignupLoginPage } from './pages/signup-login.page';

type PageFixtures = {
  navigationPage: NavigationPage;
  signupLoginPage: SignupLoginPage;
  registerAccountPage: RegisterAccountPage;
  accountCreatedPage: AccountCreatedPage;
  loginPage: LoginPage;
  productsPage: ProductsPage;
  productDetailsPage: ProductDetailsPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  paymentPage: PaymentPage;
};

/**
 * Custom Playwright fixtures wiring Page Objects (POM). Extend here when new pages appear.
 */
export const test = base.extend<PageFixtures>({
  page: async ({ page }, use) => {
    await blockThirdPartyAdRoutes(page);
    try {
      await installConsentHandler(page);
    } catch {
      // optional
    }
    try {
      await installVignetteCloseHandler(page);
    } catch {
      // optional
    }
    await use(page);
  },
  navigationPage: async ({ page }, use) => {
    await use(new NavigationPage(page));
  },
  signupLoginPage: async ({ page }, use) => {
    await use(new SignupLoginPage(page));
  },
  registerAccountPage: async ({ page }, use) => {
    await use(new RegisterAccountPage(page));
  },
  accountCreatedPage: async ({ page }, use) => {
    await use(new AccountCreatedPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  productDetailsPage: async ({ page }, use) => {
    await use(new ProductDetailsPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  paymentPage: async ({ page }, use) => {
    await use(new PaymentPage(page));
  },
});

export { expect } from '@playwright/test';
