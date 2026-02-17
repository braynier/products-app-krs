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

export function ProductsCategoryFilter({
  categories,
  disabled,
}: {
  categories: string[];
  disabled?: boolean;
}) {
  const styles = useStyles();
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get("category") ?? "all";

  const onSelect = (_: unknown, data: { optionValue?: string }) => {
    const next = data.optionValue ?? "all";
    const sp = new URLSearchParams(searchParams);

    if (!next || next === "all") sp.delete("category");
    else sp.set("category", next);

    setSearchParams(sp);
  };

  return (
    <div className={styles.root}>
      <Field label="Category">
        <Dropdown
          value={selectedCategory}
          selectedOptions={[selectedCategory]}
          onOptionSelect={onSelect as any}
          disabled={disabled}
        >
          {categories.map((c) => (
            <Option key={c} value={c}>
              {c}
            </Option>
          ))}
        </Dropdown>
      </Field>
    </div>
  );
}
