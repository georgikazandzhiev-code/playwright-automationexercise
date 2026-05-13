/**
 * Wraps an async assertion with a clearer failure prefix (helps triage CI / traces).
 * @param context - Human-readable step name.
 * @param fn - Async work (typically Playwright expects).
 */
export const withStepContext = async (context: string, fn: () => Promise<void>): Promise<void> => {
  try {
    await fn();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`[${context}] ${message}`);
  }
};
