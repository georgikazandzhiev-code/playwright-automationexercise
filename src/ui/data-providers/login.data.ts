import { requiredEnv } from '@utils/env';

export type ExistingUserCredentials = {
  email: string;
  password: string;
};

/**
 * Credentials for an account that already exists on the environment (set via .env).
 */
export const getExistingUserCredentials = (): ExistingUserCredentials => ({
  email: requiredEnv('TEST_USER_EMAIL'),
  password: requiredEnv('TEST_USER_PASSWORD'),
});
