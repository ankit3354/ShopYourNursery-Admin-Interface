// index.tsx
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import store from "./store/store";
import App from "./App";
import PlantsAdminProvider from "./contexts/PlantsAdminProvider"; // Import the new provider
import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <PlantsAdminProvider>
          <App />
        </PlantsAdminProvider>
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
