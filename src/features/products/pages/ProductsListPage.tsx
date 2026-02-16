import {
  Card,
  CardHeader,
  Divider,
  Text,
  makeStyles,
} from "@fluentui/react-components";

const useStyles = makeStyles({
  body: { padding: "16px" },
});

export function ProductsListPage() {
  const styles = useStyles();

  return (
    <Card>
      <CardHeader header={<Text weight="semibold">Products</Text>} />
      <Divider />
      <div className={styles.body}>
        <Text>Products list page</Text>
      </div>
    </Card>
  );
}
