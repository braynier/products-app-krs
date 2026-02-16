import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { QueryClientProvider } from "@tanstack/react-query";
import { makeQueryClient } from "./query/queryClient";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = makeQueryClient();

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);
