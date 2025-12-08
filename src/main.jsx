import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import AuthProvider from "./providers/AuthProvider.jsx";
import { router } from "./routes/Routes.jsx";
import { RouterProvider } from "react-router";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./providers/ThemeContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();


// This code is for all users
window.__TANSTACK_QUERY_CLIENT__ = queryClient;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster
            position="bottom-right"
            reverseOrder={false}
            toastOptions={{
              style: {
                background: "var(--color-base-100)",
                color: "var(--color-base-content)",
                borderRadius: "12px",
                padding: "14px 18px",
                border: "1px solid var(--color-base-300)",
                boxShadow: "0 0 12px rgba(0,0,0,0.3)",
              },

              success: {
                iconTheme: {
                  primary: "var(--color-success)",
                  secondary: "var(--color-base-100)",
                },
                style: {
                  border: "1px solid var(--color-success)",
                },
              },

              error: {
                iconTheme: {
                  primary: "var(--color-error)",
                  secondary: "var(--color-base-100)",
                },
                style: {
                  border: "1px solid var(--color-error)",
                },
              },

              warning: {
                iconTheme: {
                  primary: "var(--color-warning)",
                  secondary: "var(--color-base-100)",
                },
                style: {
                  border: "1px solid var(--color-warning)",
                },
              },

              info: {
                iconTheme: {
                  primary: "var(--color-info)",
                  secondary: "var(--color-base-100)",
                },
                style: {
                  border: "1px solid var(--color-info)",
                },
              },
            }}
          />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>
);
