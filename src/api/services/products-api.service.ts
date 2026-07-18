import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import {
  ApiErrorResponseSchema,
  ProductsListResponseSchema,
  SearchProductsResponseSchema,
  type ApiErrorResponse,
  type ProductsListResponse,
  type SearchProductsResponse,
} from '../schemas/automation-exercise.schema';
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
 * Every response is validated against a Zod strict schema; only business values
 * are asserted afterwards (shape/types are already proven by `.parse`).
 */
export class ProductsApiService {
  constructor(private readonly request: APIRequestContext) {}

  /**
   * GET /api/productsList — full product catalog.
   */
  getAllProducts = async (): Promise<APIResponse> => this.request.get(API_PRODUCTS_LIST_PATH);

  /**
   * POST /api/searchProduct — optional `search_product` form field.
   * @param searchProduct - When omitted, the site returns API 6 (bad request).
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
    const body = ProductsListResponseSchema.parse(await response.json());
    expect(body.responseCode, 'GET productsList responseCode').toBe(API_RESPONSE_CODE_OK);
    expect(body.products.length, 'catalog should contain products').toBeGreaterThan(0);
    return body;
  };

  /**
   * Assert API 5: POST search with a keyword returns matching products.
   * @param keyword - Value for `search_product` (e.g. top, tshirt).
   */
  assertSearchProductReturnsResults = async (keyword: string): Promise<SearchProductsResponse> => {
    const response = await this.searchProduct(keyword);
    expect(response.status(), 'POST searchProduct HTTP status').toBe(HTTP_STATUS_OK);
    const body = SearchProductsResponseSchema.parse(await response.json());
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
    const body = ApiErrorResponseSchema.parse(await response.json());
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
}
