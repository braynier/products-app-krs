import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct } from "../../../services/productsApi";
import type { UpdateProductInput } from "../../../services/productsApi";
import type { Product, ProductsResponse } from "../types";

export function useUpdateProductMutation(productId: number) {
  const queryClient = useQueryClient();

  return useMutation<Product, unknown, UpdateProductInput>({
    mutationFn: (input) => updateProduct(productId, input),
    onSuccess: (updated) => {
      // Update product detail cache
      queryClient.setQueryData<Product>(["product", productId], updated);

      // Update product in any cached products list
      queryClient.setQueriesData<ProductsResponse>(
        { queryKey: ["products"], exact: false },
        (prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            products: prev.products.map((p) =>
              p.id === updated.id ? updated : p,
            ),
          };
        },
      );
    },
  });
}
