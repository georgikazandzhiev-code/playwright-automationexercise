import { getValidSearchProductScenario } from '../../api/data-providers/search-api.data';
import { test } from '../../api/fixtures';
import { withStepContext } from '@utils/assert-context';

test.describe('API — Search product (positive)', () => {
  test(
    'POST searchProduct returns results for a keyword (API 5)',
    { tag: '@api' },
    async ({ productsApi }) => {
      const scenario = getValidSearchProductScenario();
      await withStepContext('Search catalog via API', async () => {
        await productsApi.assertSearchProductReturnsResults(scenario.keyword);
      });
    },
  );
});
