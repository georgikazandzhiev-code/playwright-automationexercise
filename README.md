# Playwright — Automation Exercise (POM)

End-to-end tests for **https://www.automationexercise.com** using the same **Page Object Model + fixtures** style as [playwright-pom-boilerplate](https://github.com/georgikazandzhiev-code/playwright-pom-boilerplate).

## What is covered

| Task          | Spec                                 | Flow                                                                     |
| ------------- | ------------------------------------ | ------------------------------------------------------------------------ |
| **1**         | `task1-register.positive.spec.ts`    | Register new user → **Account Created!** → continue → logged-in banner   |
| **1 (neg)**   | `task1-register.negative.spec.ts`    | Invalid email blocked by **HTML5** validation                            |
| **2**         | `task2-search-cart.positive.spec.ts` | Search **Tshirt** → open first hit → add to cart → cart assertions       |
| **2 (neg)**   | `task2-search.negative.spec.ts`      | Nonsense query → **zero** product cards                                  |
| **3**         | `task3-login-logout.spec.ts`         | Login with `.env` user → logout → Signup/Login visible again             |
| **3 (neg)**   | same file                            | Random email + wrong password → **Your email or password is incorrect!** |
| **API**       | `products-list.positive.spec.ts`     | **GET** `/api/productsList` → 200 + catalog (API 1)                      |
| **API**       | `search-product.positive.spec.ts`    | **POST** `/api/searchProduct` with keyword → results (API 5)             |
| **API (neg)** | `search-product.negative.spec.ts`    | **POST** search without `search_product` → JSON error (API 6)            |

## Setup

```powershell
git clone https://github.com/georgikazandzhiev-code/playwright-automationexercise.git
cd playwright-automationexercise
npm install
npx playwright install
copy .env.example .env   # then edit values
npm test          # UI + API
npm run test:ui   # browser flows only
npm run test:api  # REST API only (no browser)
npm run test:report   # full run + HTML + test-results/report.json
npm run report:open   # open HTML report in browser
```

The site may show a **cookie / consent** overlay and **Google Vignette** interstitials (`#google_vignette`) that block the UI. The suite:

- **Blocks** common ad network requests (`src/utils/consent.ts` → `blockThirdPartyAdRoutes`).
- **Strips** the vignette hash and clicks **Close** when needed (`dismissGoogleVignetteIfPresent`).
- **Clears** consent via `dismissSiteConsentDialog` and Playwright **locator handlers** registered in `src/ui/fixtures.ts`.
- Calls `resolveSiteOverlays` after `goto` and after navigation clicks that often trigger ads.

### Environment variables

| Variable             | Required for    | Notes                                            |
| -------------------- | --------------- | ------------------------------------------------ |
| `BASE_URL`           | optional        | Defaults to `https://www.automationexercise.com` |
| `TEST_USER_EMAIL`    | Task 3 positive | Existing account on the site                     |
| `TEST_USER_PASSWORD` | Task 3 positive | Matching password                                |

Create the account manually once (or reuse one from Task 1) and put credentials into `.env`. Task 3 positive is **skipped** when these are missing.

## Conventions

- **POM**: locators + assertions live in `src/ui/pages/*.page.ts`; specs orchestrate only.
- **Data**: dynamic values from `src/ui/data-providers/*`; literals from `src/utils/constants.ts`.
- **Error context**: `withStepContext` wraps major steps for clearer failures.
- **Tags**: `@e2e`, `@negative` for filtering.

## CI

GitHub Actions workflow installs browsers and runs `npm test`. For Task 3 positive, add repository **secrets** `TEST_USER_EMAIL` / `TEST_USER_PASSWORD` if you want that path to run in CI (otherwise it skips).

## Reference

UI patterns inspired by [SlavinaP23/pw-framework](https://github.com/SlavinaP23/pw-framework) (selectors such as `data-qa` and product search), implemented here **without** a PageManager — fixtures wire page objects directly.
