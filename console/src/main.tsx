import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { useApiClient } from "./hooks/useApiClient";
import { createApiClient } from "./lib/createApiClient";
import { createQueryClient } from "./lib/createQueryClient";
import { createRouter } from "./lib/createRouter";
import { AccountGuard } from "./components/AccountGuard";
import { TokenGuard } from "./components/TokenGuard";
import "./index.css";

const apiClient = createApiClient();
const queryClient = createQueryClient();
const rootEl = document.getElementById("root")!;
const reactRoot = ReactDOM.createRoot(rootEl);
const locationStartsWith = (prefix: string) =>
  location.pathname.startsWith(prefix);

export const refresh = () => {
  reactRoot.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <useApiClient.Provider apiClient={apiClient}>
          <TokenGuard>
            <AccountGuard
              skip={["/selectAccount", "/signout", "/signin"].some(
                locationStartsWith,
              )}
            >
              <RouterProvider router={createRouter()} />
            </AccountGuard>
          </TokenGuard>
        </useApiClient.Provider>
      </QueryClientProvider>
    </StrictMode>,
  );
};

refresh();
