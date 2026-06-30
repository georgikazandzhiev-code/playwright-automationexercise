import { getNoResultsSearchScenario } from '@data-providers/search.data';
import { test } from '../../ui/fixtures';

test.describe('Task 2 — Search (negative)', () => {
  test(
    'Returns no product cards for a nonsense query',
    { tag: '@negative' },
    async ({ navigationPage, productsPage }) => {
      const scenario = getNoResultsSearchScenario();
      await navigationPage.gotoPath('/');
      await navigationPage.goToProducts();
      await productsPage.searchFor(scenario.keyword);
      await productsPage.assertNoSearchResultsRendered();
    },
  );
});
