import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProfileManager from "./ProfileManager";

const queryClient = new QueryClient();

export default function ProfileWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProfileManager />
    </QueryClientProvider>
  );
}
