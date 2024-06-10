import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
import HolyLoader from "holy-loader";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster position="top-center" closeButton />
      <QueryClientProvider client={queryClient}>
        <HolyLoader color="#F5B021" height={"3px"} />
        <App />
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
);
