import { test } from '../../api/fixtures';
import { withStepContext } from '@utils/assert-context';

test.describe('API — Search product (negative)', () => {
  test(
    'POST searchProduct without search_product is rejected (API 6)',
    { tag: '@negative' },
    async ({ productsApi }) => {
      await withStepContext('POST search without search_product parameter', async () => {
        await productsApi.assertSearchProductRejectsMissingParameter();
      });
    },
  );
});
