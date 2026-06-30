import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import type {
  ApiErrorResponse,
  CatalogProduct,
  ProductsListResponse,
  SearchProductsResponse,
} from '../types/automation-exercise.types';
import {
  API_PRODUCTS_LIST_PATH,
  API_RESPONSE_CODE_CLIENT_ERROR,
  API_RESPONSE_CODE_LEGACY_BAD_REQUEST,
  API_RESPONSE_CODE_OK,
  API_SEARCH_MISSING_PARAM_MESSAGE_MARKERS,
  API_SEARCH_PRODUCT_PATH,
  HTTP_STATUS_OK,
} from '@utils/constants';

/**
 * Automation Exercise catalog/search endpoints (see /api_list on the site).
 */
export class ProductsApiService {
  constructor(private readonly request: APIRequestContext) {}

  /**
   * GET /api/productsList — full product catalog.
   */
  getAllProducts = async (): Promise<APIResponse> => this.request.get(API_PRODUCTS_LIST_PATH);

  /**
   * POST /api/searchProduct — optional `search_product` form field.
   * @param searchProduct - When omitted, the site returns API 6 (400 bad request).
   */
  searchProduct = async (searchProduct?: string): Promise<APIResponse> => {
    if (searchProduct === undefined) {
      return this.request.post(API_SEARCH_PRODUCT_PATH);
    }
    return this.request.post(API_SEARCH_PRODUCT_PATH, {
      form: { search_product: searchProduct },
    });
  };

  /**
   * Assert API 1: GET products returns HTTP 200 and a non-empty catalog.
   */
  assertGetAllProductsReturnsCatalog = async (): Promise<ProductsListResponse> => {
    const response = await this.getAllProducts();
    expect(response.status(), 'GET productsList HTTP status').toBe(HTTP_STATUS_OK);
    const body = (await response.json()) as ProductsListResponse;
    expect(body.responseCode, 'GET productsList responseCode').toBe(API_RESPONSE_CODE_OK);
    expect(body.products.length, 'catalog should contain products').toBeGreaterThan(0);
    for (const product of body.products) {
      this.assertProductShape(product);
    }
    return body;
  };

  /**
   * Assert API 5: POST search with a keyword returns matching products.
   * @param keyword - Value for `search_product` (e.g. top, tshirt).
   */
  assertSearchProductReturnsResults = async (keyword: string): Promise<SearchProductsResponse> => {
    const response = await this.searchProduct(keyword);
    expect(response.status(), 'POST searchProduct HTTP status').toBe(HTTP_STATUS_OK);
    const body = (await response.json()) as SearchProductsResponse;
    expect(body.responseCode, 'search responseCode').toBe(API_RESPONSE_CODE_OK);
    expect(body.products.length, 'search should return at least one product').toBeGreaterThan(0);
    return body;
  };

  /**
   * Assert API 6: POST search without `search_product` is rejected (JSON body, not HTTP 4xx).
   */
  assertSearchProductRejectsMissingParameter = async (): Promise<ApiErrorResponse> => {
    const response = await this.searchProduct();
    expect(response.status(), 'missing search_product HTTP status').toBe(HTTP_STATUS_OK);
    const body = (await response.json()) as ApiErrorResponse;
    expect(
      [API_RESPONSE_CODE_CLIENT_ERROR, API_RESPONSE_CODE_LEGACY_BAD_REQUEST],
      'missing search_product responseCode',
    ).toContain(body.responseCode);
    const normalizedMessage = body.message.toLowerCase();
    for (const marker of API_SEARCH_MISSING_PARAM_MESSAGE_MARKERS) {
      expect(normalizedMessage, `message should mention ${marker}`).toContain(marker);
    }
    return body;
  };

  private assertProductShape = (product: CatalogProduct): void => {
    expect(product.id, 'product id').toBeGreaterThan(0);
    expect(product.name.trim(), 'product name').not.toBe('');
    expect(product.price, 'product price').toMatch(/Rs\./i);
    expect(product.brand.trim(), 'product brand').not.toBe('');
    expect(product.category.category.trim(), 'product category').not.toBe('');
  };
}
