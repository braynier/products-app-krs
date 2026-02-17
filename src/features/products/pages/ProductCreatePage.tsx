import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  Input,
  Spinner,
  Text,
  makeStyles,
} from "@fluentui/react-components";
import { useCreateProductMutation } from "../hooks/useCreateProductMutation";

const useStyles = makeStyles({
  body: { padding: "16px", display: "grid", gap: "14px", maxWidth: "720px" },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
  actions: { display: "flex", gap: "8px" },
  error: { marginTop: "8px" },
});

function isNonEmpty(s: string) {
  return s.trim().length > 0;
}

type TouchedState = {
  title: boolean;
  category: boolean;
  description: boolean;
  price: boolean;
  stock: boolean;
};

export function ProductCreatePage() {
  const styles = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from as string | undefined;

  const goBack = () => {
    if (from) navigate(from);
    else navigate("/products");
  };

  const createMutation = useCreateProductMutation();

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [price, setPrice] = React.useState<number>(0);
  const [stock, setStock] = React.useState<number>(0);

  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const [submitAttempted, setSubmitAttempted] = React.useState(false);
  const [touched, setTouched] = React.useState<TouchedState>({
    title: false,
    category: false,
    description: false,
    price: false,
    stock: false,
  });

  const titleOk = isNonEmpty(title);
  const categoryOk = isNonEmpty(category);
  const descOk = isNonEmpty(description);
  const priceOk = Number.isFinite(price) && price >= 0;
  const stockOk = Number.isFinite(stock) && stock >= 0;

  const formOk = titleOk && categoryOk && descOk && priceOk && stockOk;

  const busy = createMutation.isPending;

  const showError = (key: keyof TouchedState) =>
    submitAttempted || touched[key];

  const onClickCreate = () => {
    setSubmitAttempted(true);
    if (!formOk) return;
    setConfirmOpen(true);
  };

  return (
    <Card>
      <CardHeader
        header={<Text weight="semibold">Create product</Text>}
        description={<Text size={200}>Add a new product</Text>}
        action={
          <div className={styles.actions}>
            <Button onClick={goBack} disabled={busy}>
              Back
            </Button>
            <Button
              appearance="primary"
              onClick={onClickCreate}
              disabled={busy || !formOk}
            >
              Create
            </Button>
          </div>
        }
      />

      <Divider />

      <div className={styles.body}>
        <Field
          label="Title"
          validationMessage={
            showError("title") && !titleOk ? "Title is required." : undefined
          }
        >
          <Input
            value={title}
            onChange={(_, d) => setTitle(d.value)}
            onBlur={() => setTouched((t) => ({ ...t, title: true }))}
            disabled={busy}
            placeholder="e.g. New phone"
          />
        </Field>

        <Field
          label="Category"
          validationMessage={
            showError("category") && !categoryOk
              ? "Category is required."
              : undefined
          }
        >
          <Input
            value={category}
            onChange={(_, d) => setCategory(d.value)}
            onBlur={() => setTouched((t) => ({ ...t, category: true }))}
            disabled={busy}
            placeholder="e.g. smartphones"
          />
        </Field>

        <Field
          label="Description"
          validationMessage={
            showError("description") && !descOk
              ? "Description is required."
              : undefined
          }
        >
          <Input
            value={description}
            onChange={(_, d) => setDescription(d.value)}
            onBlur={() => setTouched((t) => ({ ...t, description: true }))}
            disabled={busy}
            placeholder="Short description"
          />
        </Field>

        <div className={styles.row2}>
          <Field
            label="Price (€)"
            validationMessage={
              showError("price") && !priceOk
                ? "Price must be 0 or more."
                : undefined
            }
          >
            <Input
              type="number"
              value={String(price)}
              onChange={(_, d) => setPrice(Number(d.value))}
              onBlur={() => setTouched((t) => ({ ...t, price: true }))}
              disabled={busy}
            />
          </Field>

          <Field
            label="Stock"
            validationMessage={
              showError("stock") && !stockOk
                ? "Stock must be 0 or more."
                : undefined
            }
          >
            <Input
              type="number"
              value={String(stock)}
              onChange={(_, d) => setStock(Number(d.value))}
              onBlur={() => setTouched((t) => ({ ...t, stock: true }))}
              disabled={busy}
            />
          </Field>
        </div>

        {createMutation.isError && (
          <Text className={styles.error}>
            Failed to create:{" "}
            {createMutation.error instanceof Error
              ? createMutation.error.message
              : "Unknown error"}
          </Text>
        )}

        {busy && <Spinner label="Creating..." />}
      </div>

      {/* Confirmation-only modal */}
      <Dialog open={confirmOpen}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Create product?</DialogTitle>
            <DialogContent>
              <Text>
                Create <b>{title || "this product"}</b> in category{" "}
                <b>{category || "—"}</b>?
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
                disabled={!formOk || busy}
                onClick={() => {
                  createMutation.mutate(
                    {
                      title: title.trim(),
                      description: description.trim(),
                      category: category.trim(),
                      price,
                      stock,
                    },
                    {
                      onSuccess: () => {
                        setConfirmOpen(false);
                        goBack();
                      },
                    },
                  );
                }}
              >
                {busy ? "Creating..." : "Confirm"}
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </Card>
  );
}
