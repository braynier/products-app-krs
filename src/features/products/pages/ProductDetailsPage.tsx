import * as React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  Divider,
  Image,
  Spinner,
  Text,
  makeStyles,
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@fluentui/react-components";
import { useProductQuery } from "../hooks/useProductQuery";
import { useDeleteProductMutation } from "../hooks/useDeleteProductMutation";
import {
  canDeleteProducts,
  canEditProducts,
} from "../../../auth/permissions";

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
  details: { display: "grid", gap: "8px" },
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
  errorText: { marginTop: "10px" },
});

export function ProductDetailsPage() {
  const styles = useStyles();
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const productId = Number(params.id);
  const validId = Number.isFinite(productId) && productId > 0;

  const from = (location.state as any)?.from as string | undefined;

  const goBack = () => {
    if (from) navigate(from);
    else navigate("/products");
  };

  const {
    data: product,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useProductQuery(productId);

  const deleteMutation = useDeleteProductMutation();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);

  if (!validId) {
    return (
      <Card>
        <CardHeader header={<Text weight="semibold">Product details</Text>} />
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader header={<Text weight="semibold">Product details</Text>} />
        <Divider />
        <div className={styles.loadingWrap}>
          <Spinner label="Loading product..." />
        </div>
      </Card>
    );
  }

  if (isError) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return (
      <Card>
        <CardHeader header={<Text weight="semibold">Product details</Text>} />
        <Divider />
        <div className={styles.loadingWrap}>
          <Text>Failed to load product: {message}</Text>
          <div className={styles.actions} style={{ marginTop: 12 }}>
            <Button appearance="primary" onClick={() => refetch()}>
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
        <CardHeader header={<Text weight="semibold">Product details</Text>} />
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

  const busy = isFetching || deleteMutation.isLoading;

  return (
    <Card>
      <CardHeader
        header={<Text weight="semibold">{product.title}</Text>}
        description={<Text size={200}>{product.category}</Text>}
        action={
          <div className={styles.actions}>
            <Button onClick={goBack} disabled={busy}>
              Back
            </Button>

            <Button onClick={() => refetch()} disabled={busy}>
              {isFetching ? "Refreshing..." : "Refresh"}
            </Button>

            <Button
              appearance="primary"
              onClick={() =>
                navigate(`/products/${product.id}/edit`, { state: { from } })
              }
              disabled={busy || !canEditProducts}
            >
              Edit
            </Button>

            {canDeleteProducts && (
              <Button
                appearance="secondary"
                onClick={() => setConfirmDeleteOpen(true)}
                disabled={busy}
              >
                Delete
              </Button>
            )}
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
            <Text weight="semibold">Price</Text>
            <Text>€{product.price}</Text>
          </div>

          <div className={styles.kv}>
            <Text weight="semibold">Stock</Text>
            <Text>{product.stock}</Text>
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

          <Text weight="semibold">Description</Text>
          <Text style={{ opacity: 0.9 }}>{product.description}</Text>

          {deleteMutation.isError && (
            <Text className={styles.errorText}>
              Failed to delete:{" "}
              {deleteMutation.error instanceof Error
                ? deleteMutation.error.message
                : "Unknown error"}
            </Text>
          )}
        </div>
      </div>

      <Dialog open={confirmDeleteOpen && canDeleteProducts}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Delete product?</DialogTitle>
            <DialogContent>
              <Text>
                Are you sure you want to delete <b>{product.title}</b>? This
                action can’t be undone.
              </Text>
            </DialogContent>
            <DialogActions>
              <Button
                appearance="secondary"
                onClick={() => {
                  if (deleteMutation.isPending) return;
                  setConfirmDeleteOpen(false);
                }}
                disabled={deleteMutation.isLoading}
              >
                Cancel
              </Button>
              <Button
                appearance="primary"
                onClick={() => {
                  deleteMutation.mutate(product.id, {
                    onSuccess: () => {
                      setConfirmDeleteOpen(false);
                      goBack();
                    },
                  });
                }}
                disabled={deleteMutation.isPending}
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
