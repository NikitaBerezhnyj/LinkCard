"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { queryClient } from "@/lib/queryClient";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            fontFamily: "var(--font-manrope)",
            background: "#ffffff",
            border: "1px solid #e4dcc9",
            color: "#22201b"
          }
        }}
      />
    </QueryClientProvider>
  );
}
