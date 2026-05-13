import { SEARCH_KEYWORD_NO_RESULTS, SEARCH_KEYWORD_TSHIRT } from '@utils/constants';

export type ProductSearchScenario = {
  keyword: string;
};

/**
 * Positive search scenario for apparel inventory.
 */
export const getTshirtSearchScenario = (): ProductSearchScenario => ({
  keyword: SEARCH_KEYWORD_TSHIRT,
});

/**
 * Negative search scenario that should yield zero cards.
 */
export const getNoResultsSearchScenario = (): ProductSearchScenario => ({
  keyword: SEARCH_KEYWORD_NO_RESULTS,
});
