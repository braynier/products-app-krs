import * as React from "react";
import { useMemo } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Divider,
  Spinner,
  Text,
  makeStyles,
} from "@fluentui/react-components";
import { useProductsQuery } from "../hooks/useProductsQuery";
import type { Product, SortBy, SortOrder } from "../types";
import { ProductsTitleSearch } from "../components/ProductsTitleSearch";
import { ProductsCategoryFilter } from "../components/ProductsCategoryFilter";
import { ProductsSort } from "../components/ProductsSort";
import { useDeleteProductMutation } from "../hooks/useDeleteProductMutation";
import {
  canCreateProducts,
  canDeleteProducts,
  canEditProducts,
} from "../../../auth/permissions";

const useStyles = makeStyles({
  body: { padding: "16px", display: "grid", gap: "10px" },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    border: "1px solid #eee",
    borderRadius: "10px",
  },
  rowLeft: { display: "grid", gap: "4px" },
  filtersRow: {
    padding: "16px",
    display: "flex",
    gap: "16px",
    alignItems: "end",
    flexWrap: "wrap",
  },
  actions: { display: "flex", gap: "8px" },
  rowActions: { display: "flex", gap: "8px", flexWrap: "wrap" },
  errorText: { padding: "0 16px 16px" },
});

const EMPTY: Product[] = [];

export function ProductsListPage() {
  const styles = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const from = location.pathname + location.search;

  const q = searchParams.get("q") ?? "";
  const selectedCategory = searchParams.get("category") ?? "all";
  const sortBy = (searchParams.get("sortBy") as SortBy | null) ?? undefined;
  const order = (searchParams.get("order") as SortOrder | null) ?? undefined;

  const { data, isLoading, isError, error, refetch, isFetching } =
    useProductsQuery(q, sortBy, order);

  const deleteMutation = useDeleteProductMutation();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);
  const [pendingDelete, setPendingDelete] = React.useState<Product | null>(
    null,
  );

  const busy = isFetching || deleteMutation.isPending;

  const products = data?.products ?? EMPTY;

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ["all", ...Array.from(set).sort()];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader header={<Text weight="semibold">Products</Text>} />
        <Divider />
        <div className={styles.body}>
          <Spinner label="Loading products..." />
        </div>
      </Card>
    );
  }

  if (isError) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return (
      <Card>
        <CardHeader header={<Text weight="semibold">Products</Text>} />
        <Divider />
        <div className={styles.body}>
          <Text>Failed to load products: {message}</Text>
          <Button appearance="primary" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        header={<Text weight="semibold">Products</Text>}
        description={
          <Text size={200}>
            {filteredProducts.length} shown / {products.length} total
          </Text>
        }
        action={
          <div className={styles.actions}>
            {canCreateProducts && (
              <Button
                appearance="primary"
                onClick={() => navigate("/products/new", { state: { from } })}
                disabled={busy}
              >
                Add
              </Button>
            )}
            <Button onClick={() => refetch()} disabled={busy}>
              {isFetching ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        }
      />

      <Divider />

      <div className={styles.filtersRow}>
        <ProductsTitleSearch disabled={busy} />
        <ProductsCategoryFilter categories={categories} disabled={busy} />
        <ProductsSort disabled={busy} />
      </div>

      <Divider />

      <div className={styles.body}>
        {filteredProducts.map((p) => (
          <div key={p.id} className={styles.row}>
            <div className={styles.rowLeft}>
              <Text weight="semibold">{p.title}</Text>
              <Text size={200}>
                €{p.price} · {p.category} · Stock: {p.stock}
              </Text>
            </div>

            <div className={styles.rowActions}>
              <Button
                appearance="primary"
                onClick={() =>
                  navigate(`/products/${p.id}`, { state: { from } })
                }
                disabled={busy}
              >
                Details
              </Button>

              <Button
                onClick={() =>
                  navigate(`/products/${p.id}/edit`, { state: { from } })
                }
                disabled={busy || !canEditProducts}
              >
                Edit
              </Button>

              {canDeleteProducts && (
                <Button
                  appearance="secondary"
                  onClick={() => {
                    setPendingDelete(p);
                    setConfirmDeleteOpen(true);
                  }}
                  disabled={busy}
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        ))}

        {filteredProducts.length === 0 && (
          <Text>No products match your current search/filter.</Text>
        )}
      </div>

      {deleteMutation.isError && (
        <Text className={styles.errorText}>
          Failed to delete:{" "}
          {deleteMutation.error instanceof Error
            ? deleteMutation.error.message
            : "Unknown error"}
        </Text>
      )}

      <Dialog open={confirmDeleteOpen && canDeleteProducts}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Delete product?</DialogTitle>
            <DialogContent>
              <Text>
                Are you sure you want to delete{" "}
                <b>{pendingDelete?.title ?? "this product"}</b>? This can’t be
                undone.
              </Text>
            </DialogContent>
            <DialogActions>
              <Button
                appearance="secondary"
                onClick={() => {
                  if (deleteMutation.isPending) return;
                  setConfirmDeleteOpen(false);
                  setPendingDelete(null);
                }}
                disabled={deleteMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                appearance="primary"
                disabled={!pendingDelete || deleteMutation.isPending}
                onClick={() => {
                  if (!pendingDelete) return;

                  deleteMutation.mutate(pendingDelete.id, {
                    onSuccess: () => {
                      setConfirmDeleteOpen(false);
                      setPendingDelete(null);
                    },
                  });
                }}
              >
                {deleteMutation.isPending ? "Deleting..." : "Confirm"}
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </Card>
  );
}
