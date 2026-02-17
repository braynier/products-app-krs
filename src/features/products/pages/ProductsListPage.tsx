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
import { useNavigate } from "react-router-dom";

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
});

const EMPTY: Product[] = [];

export function ProductsListPage() {
  const styles = useStyles();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useProductsQuery(
    "",
    undefined,
    undefined,
  );

  const products = data?.products ?? EMPTY;

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
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        header={<Text weight="semibold">Products</Text>}
        description={<Text size={200}>{products.length} items</Text>}
      />
      <Divider />
      <div className={styles.body}>
        {products.map((p) => (
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

        {products.length === 0 && <Text>No products found.</Text>}
      </div>
    </Card>
  );
}
