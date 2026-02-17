import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "../../../services/productsApi";
import type { CreateProductInput } from "../../../services/productsApi";
import type { Product, ProductsResponse } from "../types";

export function useCreateProductMutation() {
  const qc = useQueryClient();

  return useMutation<Product, unknown, CreateProductInput>({
    mutationFn: (input) => createProduct(input),
    onSuccess: (created) => {
      // need to update all cached products queries so list shows the new item immediately
      qc.setQueriesData<ProductsResponse>(
        { queryKey: ["products"], exact: false },
        (prev) => {
          if (!prev) return prev;

          // avoid duplicates if user creates twice and cache already has it
          const exists = prev.products.some((p) => p.id === created.id);
          if (exists) return prev;

          return {
            ...prev,
            products: [created, ...prev.products],
            total: prev.total + 1,
          };
        },
      );
    },
  });
}
