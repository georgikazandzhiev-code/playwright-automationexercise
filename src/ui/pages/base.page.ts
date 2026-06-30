import { Page } from '@playwright/test';
import { resolveSiteOverlays } from '@utils/consent';

/**
 * Base page with shared navigation helpers.
 */
export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate relative to configured baseURL.
   * @param path - Path beginning with `/`.
   */
  gotoPath = async (path: string): Promise<void> => {
    // `commit` avoids hanging on long-running third-party scripts; overlays are cleared after.
    await this.page.goto(path, { waitUntil: 'commit' });
    await this.page
      .waitForLoadState('domcontentloaded', { timeout: 30_000 })
      .catch(() => undefined);
    await resolveSiteOverlays(this.page);
  };

  /**
   * After in-app navigation that may trigger interstitials (vignette / CMP).
   */
  protected settleOverlaysAfterAction = async (): Promise<void> => {
    await resolveSiteOverlays(this.page);
  };
}
