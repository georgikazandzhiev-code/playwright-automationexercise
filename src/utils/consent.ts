import type { Page } from '@playwright/test';

/**
 * Removes Google vignette nodes from the top document. Works even when the ad
 * iframe is cross-origin (we remove the iframe element from the parent DOM).
 */
export const purgeGoogleVignetteDom = async (page: Page): Promise<void> => {
  await page.evaluate(() => {
    const roots = ['google_vignette', 'google_vignette_container'];
    for (const id of roots) {
      document.getElementById(id)?.remove();
    }
    document.querySelectorAll('[id*="google_vignette" i]').forEach((el) => el.remove());
    document.querySelectorAll('iframe[id*="google_vignette" i]').forEach((el) => el.remove());

    for (const el of [document.body, document.documentElement]) {
      el.style.removeProperty('overflow');
      el.style.removeProperty('pointer-events');
    }
  });
};

/**
 * Dismisses the Automation Exercise / CMP cookie consent layer when it blocks the UI.
 * Safe to call even when no banner is shown (no-op on timeout).
 */
export const dismissSiteConsentDialog = async (page: Page): Promise<void> => {
  const rootCandidates = [
    page.getByRole('button', { name: /^consent$/i }),
    page.getByRole('button', { name: /accept all|agree to all|i agree/i }),
  ];
  for (const locator of rootCandidates) {
    try {
      await locator.first().click({ timeout: 5000 });
      await locator.first().waitFor({ state: 'detached', timeout: 5000 }).catch(() => undefined);
      return;
    } catch {
      // try next candidate
    }
  }

  for (const frame of page.frames()) {
    if (frame === page.mainFrame()) {
      continue;
    }
    try {
      await frame.getByRole('button', { name: /consent|accept all/i }).first().click({ timeout: 3000 });
      return;
    } catch {
      // next frame
    }
  }
};

const gotoStripVignetteHash = async (page: Page, cleanUrl: string): Promise<void> => {
  await page.goto(cleanUrl, { waitUntil: 'commit' });
  await page.waitForLoadState('domcontentloaded', { timeout: 30_000 }).catch(() => undefined);
};

/**
 * Google "Vignette" interstitial uses `#google_vignette` / `iframe#google_vignette` and blocks the UI.
 * Prefer DOM removal + in-frame Close; avoid clicking the first generic "Close" on the page.
 */
export const dismissGoogleVignetteIfPresent = async (page: Page): Promise<void> => {
  const url = page.url();
  if (url.includes('google_vignette')) {
    const clean = url.replace(/#google_vignette.*$/i, '');
    await gotoStripVignetteHash(page, clean);
  }

  await purgeGoogleVignetteDom(page);

  const vignetteFrame = page.locator('iframe[id*="google_vignette" i]').first();
  try {
    await vignetteFrame.waitFor({ state: 'attached', timeout: 1500 });
    await page
      .frameLocator('iframe[id*="google_vignette" i]')
      .getByRole('button', { name: /close|skip/i })
      .first()
      .click({ timeout: 4000 });
  } catch {
    // No iframe or click failed — purge again below.
  }

  await purgeGoogleVignetteDom(page);

  for (const frame of page.frames()) {
    if (frame === page.mainFrame()) {
      continue;
    }
    const frameUrl = frame.url().toLowerCase();
    if (!frameUrl || !/(google|doubleclick|googlesyndication|gstatic|safeframe)/i.test(frameUrl)) {
      continue;
    }
    try {
      await frame.getByRole('button', { name: /close|skip/i }).first().click({ timeout: 2000 });
      break;
    } catch {
      // next frame
    }
  }

  await purgeGoogleVignetteDom(page);
};

/**
 * Vignette / interstitials first, then cookie CMP (hash strip may reload CMP).
 */
export const resolveSiteOverlays = async (page: Page): Promise<void> => {
  await dismissGoogleVignetteIfPresent(page);
  await dismissSiteConsentDialog(page);
};

/**
 * Block common third-party ad requests (reduces vignette / interstitials on practice sites).
 */
export const blockThirdPartyAdRoutes = async (page: Page): Promise<void> => {
  const blockedHosts = [
    'googlesyndication',
    'doubleclick',
    'googleadservices',
    'pagead2.googlesyndication',
    'fundingchoicesmessages',
    'googleads.g.doubleclick',
    'adservice.google',
    'adtrafficquality.google',
    'googletagmanager.com',
    'fundingchoicesmessages.google.com',
    'securepubads.g.doubleclick.net',
  ];

  await page.route('**/*', async (route) => {
    const url = route.request().url().toLowerCase();
    if (blockedHosts.some((h) => url.includes(h))) {
      await route.abort();
      return;
    }
    await route.continue();
  });
};

/**
 * Auto-dismiss consent when it intercepts clicks.
 */
export const installConsentHandler = async (page: Page): Promise<void> => {
  const blocker = page.getByRole('button', { name: /^consent$/i });
  await page.addLocatorHandler(blocker, async () => {
    await page.getByRole('button', { name: /^consent$/i }).first().click();
  });
};

/**
 * When an action hits the vignette layer, tear it down (remove iframe / wrapper from DOM)
 * and try an in-frame Close if the node still exists.
 */
export const installVignetteCloseHandler = async (page: Page): Promise<void> => {
  const vignetteLayer = page
    .locator('iframe[id*="google_vignette" i]')
    .or(page.locator('#google_vignette'))
    .first();
  await page.addLocatorHandler(vignetteLayer, async () => {
    await purgeGoogleVignetteDom(page);
    try {
      await page
        .frameLocator('iframe[id*="google_vignette" i]')
        .getByRole('button', { name: /close|skip/i })
        .first()
        .click({ timeout: 2500 });
    } catch {
      // iframe may already be gone after purge
    }
    await purgeGoogleVignetteDom(page);
  });
};
