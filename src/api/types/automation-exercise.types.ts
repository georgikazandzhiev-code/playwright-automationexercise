/**
 * Back-compat re-export. The single source of truth for API response shapes is now
 * the Zod schema module (types are inferred from the schemas there).
 */
export type {
  ProductCategory,
  CatalogProduct,
  ProductsListResponse,
  SearchProductsResponse,
  ApiErrorResponse,
  ApiMessageResponse,
} from '../schemas/automation-exercise.schema';
