import { useSearchParams } from "react-router-dom";
import {
  Dropdown,
  Field,
  Option,
  makeStyles,
} from "@fluentui/react-components";

const useStyles = makeStyles({
  root: { minWidth: "220px" },
});

type SortValue =
  | "none"
  | "price_asc"
  | "price_desc"
  | "stock_asc"
  | "stock_desc";

function toSortValue(sortBy?: string | null, order?: string | null): SortValue {
  if (!sortBy || !order) return "none";
  if (sortBy === "price" && order === "asc") return "price_asc";
  if (sortBy === "price" && order === "desc") return "price_desc";
  if (sortBy === "stock" && order === "asc") return "stock_asc";
  if (sortBy === "stock" && order === "desc") return "stock_desc";
  return "none";
}

function fromSortValue(v: SortValue): {
  sortBy?: "price" | "stock";
  order?: "asc" | "desc";
} {
  switch (v) {
    case "price_asc":
      return { sortBy: "price", order: "asc" };
    case "price_desc":
      return { sortBy: "price", order: "desc" };
    case "stock_asc":
      return { sortBy: "stock", order: "asc" };
    case "stock_desc":
      return { sortBy: "stock", order: "desc" };
    default:
      return {};
  }
}

export function ProductsSort({ disabled }: { disabled?: boolean }) {
  const styles = useStyles();
  const [searchParams, setSearchParams] = useSearchParams();

  const sortBy = searchParams.get("sortBy");
  const order = searchParams.get("order");

  const value = toSortValue(sortBy, order);

  const onSelect = (_: unknown, data: { optionValue?: string }) => {
    const next = (data.optionValue ?? "none") as SortValue;
    const sp = new URLSearchParams(searchParams);

    const mapped = fromSortValue(next);

    if (!mapped.sortBy || !mapped.order) {
      sp.delete("sortBy");
      sp.delete("order");
    } else {
      sp.set("sortBy", mapped.sortBy);
      sp.set("order", mapped.order);
    }

    setSearchParams(sp);
  };

  return (
    <div className={styles.root}>
      <Field label="Sort">
        <Dropdown
          value={value}
          selectedOptions={[value]}
          onOptionSelect={onSelect as any}
          disabled={disabled}
        >
          <Option value="none">None</Option>
          <Option value="price_asc">Price: low → high</Option>
          <Option value="price_desc">Price: high → low</Option>
          <Option value="stock_asc">Stock: low → high</Option>
          <Option value="stock_desc">Stock: high → low</Option>
        </Dropdown>
      </Field>
    </div>
  );
}
