import { StrictMode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRouter from "./Router";

const queryClient = new QueryClient();

export const App = () => {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AppRouter />
      </QueryClientProvider>
    </StrictMode>
  );
};

export default App;
