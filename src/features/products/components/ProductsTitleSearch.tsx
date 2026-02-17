import * as React from "react";
import { useSearchParams } from "react-router-dom";
import { Field, Input, makeStyles } from "@fluentui/react-components";

const useStyles = makeStyles({
  root: { minWidth: "260px" },
});

export function ProductsTitleSearch({ disabled }: { disabled?: boolean }) {
  const styles = useStyles();
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const [value, setValue] = React.useState(q);

  // sync input if user navigates back/forward
  React.useEffect(() => {
    setValue(q);
  }, [q]);

  const apply = (next: string) => {
    const sp = new URLSearchParams(searchParams);
    const trimmed = next.trim();

    if (trimmed) sp.set("q", trimmed);
    else sp.delete("q");

    setSearchParams(sp);
  };

  return (
    <div className={styles.root}>
      <Field label="Search title">
        <Input
          value={value}
          onChange={(_, d) => setValue(d.value)}
          placeholder="e.g. phone"
          disabled={disabled}
          onKeyDown={(e) => {
            if (e.key === "Enter") apply(value);
            if (e.key === "Escape") {
              setValue("");
              apply("");
            }
          }}
        />
      </Field>
    </div>
  );
}
