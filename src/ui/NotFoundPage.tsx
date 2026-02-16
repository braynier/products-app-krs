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
});

export function NotFoundPage() {
  const styles = useStyles();
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader
        header={<Text weight="semibold">Page not found</Text>}
        description={<Text size={200}>404</Text>}
      />
      <Divider />
      <div className={styles.body}>
        <Text>The page you’re looking for doesn’t exist.</Text>
        <Button appearance="primary" onClick={() => navigate("/products")}>
          Go to Products
        </Button>
      </div>
    </Card>
  );
}
