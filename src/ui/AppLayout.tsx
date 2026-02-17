import { Outlet, useNavigate } from "react-router-dom";
import {
  Toolbar,
  ToolbarButton,
  Title3,
  makeStyles,
} from "@fluentui/react-components";

const useStyles = makeStyles({
  root: { minHeight: "100vh" },
  topBar: { borderBottom: "1px solid #eee" },
  content: { padding: "16px" },
  title: { marginRight: "16px" },
  spacer: { marginLeft: "auto" },
});

export function AppLayout() {
  const styles = useStyles();
  const navigate = useNavigate();

  return (
    <div className={styles.root}>
      <div className={styles.topBar}>
        <Toolbar>
          <Title3 className={styles.title}>Products App</Title3>

          <ToolbarButton onClick={() => navigate("/products")}>
            Products
          </ToolbarButton>

          <div className={styles.spacer} />
        </Toolbar>
      </div>

      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}
