import { StrictMode } from "react";
import AppRouter from "./Router";

export const App = () => {
  return (
    <StrictMode>
      <h1>React Router App</h1>
      <AppRouter />
    </StrictMode>
  );
};

export default App;
