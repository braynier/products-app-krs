import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct } from "../../../services/productsApi";
import type { ProductsResponse, Product } from "../types";

export function useDeleteProductMutation() {
  const queryClient = useQueryClient();

  return useMutation<{ id: number }, unknown, number>({
    mutationFn: (id) => deleteProduct(id),

    onSuccess: (_res, id) => {
      queryClient.removeQueries({ queryKey: ["product", id], exact: true });

      queryClient.setQueriesData<ProductsResponse>(
        { queryKey: ["products"], exact: false },
        (prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            products: prev.products.filter((p) => p.id !== id),
            total: Math.max(0, prev.total - 1),
          };
        },
      );

      queryClient.setQueriesData<Product>(
        { queryKey: ["product"], exact: false },
        (prev) => (prev && (prev as any).id === id ? undefined : prev),
      );
    },
  });
}
