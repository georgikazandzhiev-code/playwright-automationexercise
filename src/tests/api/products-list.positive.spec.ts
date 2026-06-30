import { test } from '../../api/fixtures';
import { withStepContext } from '@utils/assert-context';

test.describe('API — Products catalog', () => {
  test(
    'GET productsList returns full catalog (API 1)',
    { tag: '@api' },
    async ({ productsApi }) => {
      await withStepContext('Fetch all products', async () => {
        await productsApi.assertGetAllProductsReturnsCatalog();
      });
    },
  );
});
