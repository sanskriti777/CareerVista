import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

import App from "./App.jsx";

import { SavedJobsProvider } from "./context/SavedJobsContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SavedJobsProvider>
      <App />
    </SavedJobsProvider>
  </StrictMode>
);