import type { RegisterAccountForm } from '@pages/register-account.page';

export type RegistrationScenario = {
  displayName: string;
  email: string;
  password: string;
  account: RegisterAccountForm;
};

/**
 * Build a unique registration dataset (email uniqueness required by the site).
 */
export const getUniqueRegistrationScenario = (): RegistrationScenario => {
  const stamp = Date.now();
  const displayName = `QA User ${stamp}`;
  const email = `qa_user_${stamp}@mailinator.com`;
  const password = `Pw!${stamp}Aa1`;
  const account: RegisterAccountForm = {
    password,
    firstName: `First${stamp}`,
    lastName: `Last${stamp}`,
    company: `Company ${stamp}`,
    address: `${stamp} Automation Street`,
    state: 'California',
    city: 'Los Angeles',
    zip: '90001',
    mobile: '5551234567',
  };
  return { displayName, email, password, account };
};
