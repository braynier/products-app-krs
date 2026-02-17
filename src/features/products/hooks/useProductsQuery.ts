import { useQuery } from "@tanstack/react-query";
import { getProducts, searchProducts } from "../../../services/productsApi";
import type { ProductsResponse, SortBy, SortOrder } from "../types";

export function useProductsQuery(
  q: string,
  sortBy?: SortBy,
  order?: SortOrder,
) {
  const query = q.trim();

  return useQuery<ProductsResponse>({
    queryKey: [
      "products",
      { q: query, sortBy: sortBy ?? null, order: order ?? null },
    ],
    queryFn: () =>
      query ? searchProducts(query, sortBy, order) : getProducts(sortBy, order),
  });
}
