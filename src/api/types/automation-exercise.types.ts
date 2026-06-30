export type ProductCategory = {
  usertype: { usertype: string };
  category: string;
};

export type CatalogProduct = {
  id: number;
  name: string;
  price: string;
  brand: string;
  category: ProductCategory;
};

export type ProductsListResponse = {
  responseCode: number;
  products: CatalogProduct[];
};

export type SearchProductsResponse = {
  responseCode: number;
  products: CatalogProduct[];
};

export type ApiErrorResponse = {
  responseCode: number;
  message: string;
};
