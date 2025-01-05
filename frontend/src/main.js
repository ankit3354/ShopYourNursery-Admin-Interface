import { jsx as _jsx } from "react/jsx-runtime";
// index.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import store from "./store/store";
import App from "./App";
import PlantsAdminProvider from "./contexts/PlantsAdminProvider"; // Import the new provider
import "./index.css";
const queryClient = new QueryClient();
createRoot(document.getElementById("root")).render(_jsx(StrictMode, { children: _jsx(Provider, { store: store, children: _jsx(QueryClientProvider, { client: queryClient, children: _jsx(PlantsAdminProvider, { children: _jsx(App, {}) }) }) }) }));
