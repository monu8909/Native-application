import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

import { queryClient } from "../services/queryClient";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toast />
    </QueryClientProvider>
  );
}

