import { expect, Locator, Page } from '@playwright/test';
import { DEFAULT_COUNTRY_LABEL } from '@utils/constants';
import { BasePage } from './base.page';

export type RegisterAccountForm = {
  password: string;
  firstName: string;
  lastName: string;
  company: string;
  address: string;
  state: string;
  city: string;
  zip: string;
  mobile: string;
};

/**
 * `/signup` — "Enter Account Information" + address block.
 */
export class RegisterAccountPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Locators (top) ── (testIdAttribute = data-qa; #id fallbacks are last resort)
  get passwordInput(): Locator {
    return this.page.getByTestId('password').or(this.page.locator('#password'));
  }

  get firstNameInput(): Locator {
    return this.page.getByTestId('first_name');
  }

  get lastNameInput(): Locator {
    return this.page.getByTestId('last_name');
  }

  get companyInput(): Locator {
    return this.page.getByTestId('company');
  }

  get addressInput(): Locator {
    return this.page.getByTestId('address1').or(this.page.getByTestId('address'));
  }

  get countrySelect(): Locator {
    return this.page.getByTestId('country');
  }

  get stateInput(): Locator {
    return this.page.getByTestId('state');
  }

  get cityInput(): Locator {
    return this.page.getByTestId('city');
  }

  get zipInput(): Locator {
    return this.page.getByTestId('zipcode');
  }

  get mobileInput(): Locator {
    return this.page.getByTestId('mobile_number');
  }

  get createAccountButton(): Locator {
    return this.page.getByTestId('create-account');
  }

  get mrTitleRadio(): Locator {
    return this.page.locator('#id_gender1');
  }

  get daySelect(): Locator {
    return this.page.locator('#days');
  }

  get monthSelect(): Locator {
    return this.page.locator('#months');
  }

  get yearSelect(): Locator {
    return this.page.locator('#years');
  }

  // ── Methods (below) ──
  /**
   * Complete the registration address/account form and submit.
   * @param data - Structured address + security fields.
   */
  fillAccountInformationAndSubmit = async (data: RegisterAccountForm): Promise<void> => {
    await this.mrTitleRadio.check();
    await this.passwordInput.fill(data.password);
    await this.daySelect.selectOption('10');
    await this.monthSelect.selectOption('January');
    await this.yearSelect.selectOption('1990');
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.companyInput.fill(data.company);
    await this.addressInput.fill(data.address);
    await this.countrySelect.selectOption({ label: DEFAULT_COUNTRY_LABEL });
    await this.stateInput.fill(data.state);
    await this.cityInput.fill(data.city);
    await this.zipInput.fill(data.zip);
    await this.mobileInput.fill(data.mobile);
    await this.createAccountButton.click();
    await this.settleOverlaysAfterAction();
  };

  /**
   * Assert HTML5 blocks submit when password is empty (negative path).
   */
  assertEmptyPasswordBlockedByHtml5 = async (): Promise<void> => {
    await this.mrTitleRadio.check();
    await this.passwordInput.fill('');
    await this.firstNameInput.fill('Test');
    await this.lastNameInput.fill('User');
    await this.addressInput.fill('1 Test Street');
    await this.countrySelect.selectOption({ label: DEFAULT_COUNTRY_LABEL });
    await this.stateInput.fill('CA');
    await this.cityInput.fill('LA');
    await this.zipInput.fill('90001');
    await this.mobileInput.fill('5551234567');
    const validity = await this.passwordInput.evaluate<boolean>(
      (el: HTMLElement | SVGElement) => (el as HTMLInputElement).validity.valid,
    );
    expect(validity, 'Expected empty password to be invalid per HTML5').toBe(false);
  };
}
