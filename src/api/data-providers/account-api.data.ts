import { DEFAULT_COUNTRY_LABEL } from '@utils/constants';

/** Form payload accepted by POST /api/createAccount (API 11). */
export type SeedAccountPayload = {
  name: string;
  email: string;
  password: string;
  title: string;
  birth_date: string;
  birth_month: string;
  birth_year: string;
  firstname: string;
  lastname: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  zipcode: string;
  state: string;
  city: string;
  mobile_number: string;
};

/** A seeded account plus the fields we later verify in the checkout address block. */
export type SeededAccount = {
  email: string;
  password: string;
  name: string;
  firstName: string;
  lastName: string;
  address1: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  mobile: string;
  payload: SeedAccountPayload;
};

/**
 * Build a unique account for API seeding (email uniqueness required by the site).
 * The address values are asserted against the checkout page in Task 4.
 */
export const buildSeededAccount = (): SeededAccount => {
  const stamp = Date.now();
  const email = `qa_seed_${stamp}@mailinator.com`;
  const password = `Pw!${stamp}Aa1`;
  const name = `Seed User ${stamp}`;
  const firstName = `First${stamp}`;
  const lastName = `Last${stamp}`;
  const address1 = `${stamp} Automation Street`;
  const city = 'Los Angeles';
  const state = 'California';
  const zip = '90001';
  const country = DEFAULT_COUNTRY_LABEL;
  const mobile = '5551234567';

  return {
    email,
    password,
    name,
    firstName,
    lastName,
    address1,
    city,
    state,
    zip,
    country,
    mobile,
    payload: {
      name,
      email,
      password,
      title: 'Mr',
      birth_date: '10',
      birth_month: 'January',
      birth_year: '1990',
      firstname: firstName,
      lastname: lastName,
      company: `Company ${stamp}`,
      address1,
      address2: '',
      country,
      zipcode: zip,
      state,
      city,
      mobile_number: mobile,
    },
  };
};
