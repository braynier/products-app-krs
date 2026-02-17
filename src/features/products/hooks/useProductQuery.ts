import { useQuery } from "@tanstack/react-query";
import { getProductById } from "../../../services/productsApi";
import type { Product } from "../types";

export function useProductQuery(productId: number) {
  const enabled = Number.isFinite(productId) && productId > 0;

  return useQuery<Product>({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId),
    enabled,
  });
}
