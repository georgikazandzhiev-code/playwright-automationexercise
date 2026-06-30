/** Default UI base URL (override with BASE_URL in .env). */
export const DEFAULT_BASE_HOST = 'www.automationexercise.com';

/** REST paths (Automation Exercise API list). */
export const API_PRODUCTS_LIST_PATH = '/api/productsList';
export const API_SEARCH_PRODUCT_PATH = '/api/searchProduct';

/** API body `responseCode` values (site JSON; HTTP status is often 200 for all). */
export const API_RESPONSE_CODE_OK = 200;
/** Current JSON error code on some deployments. */
export const API_RESPONSE_CODE_CLIENT_ERROR = 3;
/** Legacy JSON error code still returned on www host (API 6). */
export const API_RESPONSE_CODE_LEGACY_BAD_REQUEST = 400;

/** HTTP status codes used in API assertions. */
export const HTTP_STATUS_OK = 200;

/** Substrings expected in API 6 error message (wording varies by host). */
export const API_SEARCH_MISSING_PARAM_MESSAGE_MARKERS = ['search_product', 'missing'] as const;

/** Success heading after full registration (Automation Exercise). */
export const ACCOUNT_CREATED_HEADING = 'Account Created!';

/** Login failure copy from site (Test Case 3). */
export const LOGIN_ERROR_INCORRECT = 'Your email or password is incorrect!';

/** Search keyword with stable inventory on the demo shop. */
export const SEARCH_KEYWORD_TSHIRT = 'Tshirt';

/** Deliberately empty-result style query for negative search. */
export const SEARCH_KEYWORD_NO_RESULTS = '___no_such_product_zzzz___';

/** Wrong password for negative login (never a real account password). */
export const WRONG_PASSWORD_PLACEHOLDER = 'WrongPassword!12345';

/** Default country label for signup address form. */
export const DEFAULT_COUNTRY_LABEL = 'United States';

/** Default timeouts (ms). */
export const DEFAULT_EXPECT_TIMEOUT_MS = 25_000;
export const DEFAULT_ACTION_TIMEOUT_MS = 20_000;
