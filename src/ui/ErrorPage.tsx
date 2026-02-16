import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  Divider,
  Text,
  makeStyles,
} from "@fluentui/react-components";

const useStyles = makeStyles({
  body: { padding: "16px", display: "grid", gap: "12px" },
  actions: { display: "flex", gap: "8px", flexWrap: "wrap" },
});

export function ErrorPage() {
  const styles = useStyles();
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader
        header={<Text weight="semibold">Something went wrong</Text>}
      />
      <Divider />
      <div className={styles.body}>
        <Text>
          Something went wrong. Try reloading or going back to products.
        </Text>
        <div className={styles.actions}>
          <Button appearance="primary" onClick={() => navigate("/products")}>
            Go to Products
          </Button>
          <Button onClick={() => window.location.reload()}>Reload</Button>
        </div>
      </div>
    </Card>
  );
}
