import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  Divider,
  Spinner,
  Text,
  makeStyles,
} from "@fluentui/react-components";
import { useProductsQuery } from "../hooks/useProductsQuery";
import type { Product } from "../types";
import { ProductsTitleSearch } from "../components/ProductsTitleSearch";
import { ProductsCategoryFilter } from "../components/ProductsCategoryFilter";

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
  actions: { display: "flex", gap: "8px", flexWrap: "wrap" },
});

const EMPTY: Product[] = [];

export function ProductsListPage() {
  const styles = useStyles();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const selectedCategory = searchParams.get("category") ?? "all";

  const { data, isLoading, isError, error, refetch, isFetching } =
    useProductsQuery(q, undefined, undefined);

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
            <Button onClick={() => refetch()} disabled={isFetching}>
              {isFetching ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        }
      />

      <Divider />

      <div className={styles.filtersRow}>
        <ProductsTitleSearch disabled={isFetching} />
        <ProductsCategoryFilter categories={categories} disabled={isFetching} />
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

            <Button
              appearance="primary"
              onClick={() => navigate(`/products/${p.id}`)}
            >
              Details
            </Button>
          </div>
        ))}

        {filteredProducts.length === 0 && (
          <Text>No products match your current search/filter.</Text>
        )}
      </div>
    </Card>
  );
}
