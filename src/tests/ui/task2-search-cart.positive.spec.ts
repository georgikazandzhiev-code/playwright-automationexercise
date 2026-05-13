import { getTshirtSearchScenario } from '@data-providers/search.data';
import { test } from '../../ui/fixtures';
import { withStepContext } from '@utils/assert-context';

test.describe('Task 2 — Search and cart', () => {
  test('Search, open product, add to cart, verify cart line item', { tag: '@e2e' }, async ({
    navigationPage,
    productsPage,
    productDetailsPage,
    cartPage,
  }) => {
    const scenario = getTshirtSearchScenario();
    await withStepContext('Open products catalog', async () => {
      await navigationPage.gotoPath('/');
      await navigationPage.goToProducts();
    });
    await withStepContext('Search catalog', async () => {
      await productsPage.searchFor(scenario.keyword);
    });
    await withStepContext('Verify search relevance', async () => {
      await productsPage.assertAllVisibleResultsContainKeyword(scenario.keyword);
    });
    await withStepContext('Open first search hit', async () => {
      await productsPage.openFirstViewProduct();
    });
    const summary = await productDetailsPage.readProductSummary();
    await withStepContext('Add product to cart', async () => {
      await productDetailsPage.addToCartAndContinueShopping();
    });
    await withStepContext('Open cart and verify line item', async () => {
      await navigationPage.goToCart();
      await cartPage.assertLineItemMatches(summary.name, summary.price, '1');
    });
  });
});
