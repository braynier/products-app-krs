import { httpJson } from "./http";
import type {
  ProductsResponse,
  Product,
  SortBy,
  SortOrder,
} from "../features/products/types";

const BASE_URL = "https://dummyjson.com";

function buildSortParams(sortBy?: SortBy, order?: SortOrder) {
  if (!sortBy || !order) return "";
  const sp = new URLSearchParams();
  sp.set("sortBy", sortBy);
  sp.set("order", order);
  return `&${sp.toString()}`;
}

const DEFAULT_LIMIT = 0;

export function getProducts(sortBy?: SortBy, order?: SortOrder) {
  return httpJson<ProductsResponse>(
    `${BASE_URL}/products?limit=${DEFAULT_LIMIT}${buildSortParams(sortBy, order)}`,
  );
}

export function searchProducts(q: string, sortBy?: SortBy, order?: SortOrder) {
  const query = encodeURIComponent(q.trim());
  return httpJson<ProductsResponse>(
    `${BASE_URL}/products/search?q=${query}&limit=${DEFAULT_LIMIT}${buildSortParams(sortBy, order)}`,
  );
}

export function getProductById(id: number) {
  return httpJson<Product>(`${BASE_URL}/products/${id}`);
}
