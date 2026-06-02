"use client";

import { getQueryClient } from "@/lib/get-query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { GameActionsProvider } from "@/components/providers/game-actions-provider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <GameActionsProvider>{children}</GameActionsProvider>
    </QueryClientProvider>
  );
};

export default Providers;
