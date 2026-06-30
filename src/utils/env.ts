/**
 * Read a required environment variable or throw with a clear message.
 * @param name - Environment variable name.
 */
export const requiredEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required env var: ${name}. Add it to your .env file (see .env.example).`,
    );
  }
  return value;
};
