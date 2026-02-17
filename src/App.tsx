import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { makeQueryClient } from "./query/queryClient";
import { AppLayout } from "./ui/AppLayout";
import { NotFoundPage } from "./ui/NotFoundPage";
import { ErrorPage } from "./ui/ErrorPage";
import { ProductsListPage } from "./features/products/pages/ProductsListPage";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { ProductDetailsPage } from "./features/products/pages/ProductDetailsPage";

const queryClient = makeQueryClient();

export default function App() {
  return (
    <FluentProvider theme={webLightTheme}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<Navigate replace to="/products" />} />
              <Route path="/products" element={<ProductsListPage />} />
              <Route path="/products/:id" element={<ProductDetailsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
            <Route path="/error" element={<ErrorPage />} />
          </Routes>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </FluentProvider>
  );
}
