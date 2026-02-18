import * as React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  Divider,
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
  Field,
  Image,
  Input,
  Spinner,
  Text,
  makeStyles,
} from "@fluentui/react-components";

import { useProductQuery } from "../hooks/useProductQuery";
import { useUpdateProductMutation } from "../hooks/useEditProductMutation";
import { canEditProducts } from "../../../auth/permissions";

const useStyles = makeStyles({
  body: {
    padding: "16px",
    display: "grid",
    gap: "16px",
    gridTemplateColumns: "280px 1fr",
    alignItems: "start",
  },
  image: {
    width: "280px",
    height: "280px",
    borderRadius: "12px",
    border: "1px solid #eee",
  },
  imageFallback: {
    width: "280px",
    height: "280px",
    borderRadius: "12px",
    border: "1px solid #eee",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fafafa",
  },
  details: { display: "grid", gap: "10px" },
  kv: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    padding: "8px 10px",
    border: "1px solid #eee",
    borderRadius: "10px",
  },
  actions: { display: "flex", gap: "8px" },
  loadingWrap: { padding: "16px" },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
});

type Touched = { price: boolean; stock: boolean };

function parseNumber(s: string): number | null {
  if (s.trim() === "") return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

export function ProductEditPage() {
  const styles = useStyles();
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const from = (location.state as any)?.from as string | undefined;

  const goBack = () => {
    if (from) navigate(from);
    else navigate("/products");
  };

  const productId = Number(params.id);
  const validId = Number.isFinite(productId) && productId > 0;

  const productQuery = useProductQuery(productId);
  const product = productQuery.data;

  const updateMutation = useUpdateProductMutation(productId);

  const [priceStr, setPriceStr] = React.useState("0");
  const [stockStr, setStockStr] = React.useState("0");

  const [submitAttempted, setSubmitAttempted] = React.useState(false);
  const [touched, setTouched] = React.useState<Touched>({
    price: false,
    stock: false,
  });

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const busy = productQuery.isFetching || updateMutation.isPending;

  const price = parseNumber(priceStr);
  const stock = parseNumber(stockStr);

  const priceOk = price !== null && price >= 0;
  const stockOk = stock !== null && stock >= 0;

  const showErr = (k: keyof Touched) => submitAttempted || touched[k];

  const hasChanges =
    String(product?.price) !== priceStr.trim() ||
    String(product?.stock) !== stockStr.trim();

  const formOk = priceOk && stockOk && hasChanges;

  const onClickSave = () => {
    setSubmitAttempted(true);
    if (!priceOk || !stockOk) return;
    if (!hasChanges) return;
    setConfirmOpen(true);
  };

  React.useEffect(() => {
    const p = productQuery.data;
    if (!p) return;

    setPriceStr(String(p.price));
    setStockStr(String(p.stock));
    setSubmitAttempted(false);
    setTouched({ price: false, stock: false });
  }, [productQuery.data]);

  if (!canEditProducts) {
    return (
      <Card>
        <CardHeader header={<Text weight="semibold">Edit product</Text>} />
        <Divider />
        <div className={styles.loadingWrap}>
          <Text>You do not have permission to edit products.</Text>
          <div style={{ marginTop: 12 }}>
            <Button onClick={goBack}>Back</Button>
          </div>
        </div>
      </Card>
    );
  }

  if (!validId) {
    return (
      <Card>
        <CardHeader header={<Text weight="semibold">Edit product</Text>} />
        <Divider />
        <div className={styles.loadingWrap}>
          <Text>Invalid product id.</Text>
          <div style={{ marginTop: 12 }}>
            <Button onClick={() => navigate("/products")}>
              Back to products
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  if (productQuery.isLoading) {
    return (
      <Card>
        <CardHeader header={<Text weight="semibold">Edit product</Text>} />
        <Divider />
        <div className={styles.loadingWrap}>
          <Spinner label="Loading product..." />
        </div>
      </Card>
    );
  }

  if (productQuery.isError) {
    const message =
      productQuery.error instanceof Error
        ? productQuery.error.message
        : "Unknown error";
    return (
      <Card>
        <CardHeader header={<Text weight="semibold">Edit product</Text>} />
        <Divider />
        <div className={styles.loadingWrap}>
          <Text>Failed to load product: {message}</Text>
          <div className={styles.actions} style={{ marginTop: 12 }}>
            <Button appearance="primary" onClick={() => productQuery.refetch()}>
              Retry
            </Button>
            <Button onClick={goBack}>Back</Button>
          </div>
        </div>
      </Card>
    );
  }

  if (!product) {
    return (
      <Card>
        <CardHeader header={<Text weight="semibold">Edit product</Text>} />
        <Divider />
        <div className={styles.loadingWrap}>
          <Text>Product not found.</Text>
          <Button onClick={() => navigate("/products")}>
            Back to products
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        header={<Text weight="semibold">Edit: {product.title}</Text>}
        description={<Text size={200}>{product.category}</Text>}
        action={
          <div className={styles.actions}>
            <Button onClick={goBack} disabled={busy}>
              Back
            </Button>

            <Button onClick={() => productQuery.refetch()} disabled={busy}>
              {productQuery.isFetching ? "Refreshing..." : "Refresh"}
            </Button>

            <Button
              appearance="primary"
              onClick={onClickSave}
              disabled={busy || !formOk}
            >
              Save
            </Button>
          </div>
        }
      />

      <Divider />

      <div className={styles.body}>
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
            fit="cover"
            className={styles.image}
          />
        ) : (
          <div className={styles.imageFallback}>
            <Text>No image</Text>
          </div>
        )}

        <div className={styles.details}>
          <div className={styles.kv}>
            <Text weight="semibold">Category</Text>
            <Text>{product.category}</Text>
          </div>

          {product.brand && (
            <div className={styles.kv}>
              <Text weight="semibold">Brand</Text>
              <Text>{product.brand}</Text>
            </div>
          )}

          {typeof product.rating === "number" && (
            <div className={styles.kv}>
              <Text weight="semibold">Rating</Text>
              <Text>{product.rating}</Text>
            </div>
          )}

          <Divider style={{ margin: "8px 0" }} />

          <Text weight="semibold">Editable fields</Text>

          <div className={styles.row2}>
            <Field
              label="Price (€)"
              validationMessage={
                showErr("price") && !priceOk
                  ? "Price must be 0 or more."
                  : undefined
              }
            >
              <Input
                type="number"
                value={priceStr}
                onChange={(_, d) => setPriceStr(d.value)}
                onBlur={() => setTouched((t) => ({ ...t, price: true }))}
                disabled={busy}
              />
            </Field>

            <Field
              label="Stock"
              validationMessage={
                showErr("stock") && !stockOk
                  ? "Stock must be 0 or more."
                  : undefined
              }
            >
              <Input
                type="number"
                value={stockStr}
                onChange={(_, d) => setStockStr(d.value)}
                onBlur={() => setTouched((t) => ({ ...t, stock: true }))}
                disabled={busy}
              />
            </Field>
          </div>

          <Divider style={{ margin: "8px 0" }} />

          <Text weight="semibold">Description</Text>
          <Text style={{ opacity: 0.9 }}>{product.description}</Text>

          {!hasChanges && (
            <Text size={200} style={{ opacity: 0.8 }}>
              No changes to save.
            </Text>
          )}

          {updateMutation.isError && (
            <Text>
              Failed to save:{" "}
              {updateMutation.error instanceof Error
                ? updateMutation.error.message
                : "Unknown error"}
            </Text>
          )}
        </div>
      </div>

      <Dialog open={confirmOpen}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Save changes?</DialogTitle>
            <DialogContent>
              <Text>
                Save updated <b>price</b> and <b>stock</b> for{" "}
                <b>{product.title}</b>?
              </Text>
            </DialogContent>
            <DialogActions>
              <Button
                appearance="secondary"
                onClick={() => {
                  if (busy) return;
                  setConfirmOpen(false);
                }}
                disabled={busy}
              >
                Cancel
              </Button>
              <Button
                appearance="primary"
                disabled={!priceOk || !stockOk || !hasChanges || busy}
                onClick={() => {
                  if (price === null || stock === null) return;

                  updateMutation.mutate(
                    { price, stock },
                    {
                      onSuccess: () => {
                        setConfirmOpen(false);
                        goBack();
                      },
                    },
                  );
                }}
              >
                {busy ? "Saving..." : "Confirm"}
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </Card>
  );
}
