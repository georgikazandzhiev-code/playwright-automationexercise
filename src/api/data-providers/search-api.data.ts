import { SEARCH_KEYWORD_TSHIRT } from '@utils/constants';

export type SearchApiScenario = {
  keyword: string;
};

/**
 * Stable keyword for API 5 (POST searchProduct) — aligns with UI Task 2 inventory.
 */
export const getValidSearchProductScenario = (): SearchApiScenario => ({
  keyword: SEARCH_KEYWORD_TSHIRT,
});
