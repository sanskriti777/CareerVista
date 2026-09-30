import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

import App from "./App.jsx";

import { SavedJobsProvider } from "./context/SavedJobsContext";
import { ApplicationsProvider } from "./context/ApplicationsContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <SavedJobsProvider>
          <ApplicationsProvider>
            <App />
          </ApplicationsProvider>
        </SavedJobsProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);