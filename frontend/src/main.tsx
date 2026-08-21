import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { RepoProvider } from "./context/RepoContext";
import { BackgroundBlobs } from "./components/BackgroundBlobs";
import App from "./App";
import "./styles/index.css";

const container = document.getElementById("root");
if (!container) throw new Error("Root element #root not found");

createRoot(container).render(
  <StrictMode>
    <BrowserRouter>
      <RepoProvider>
        <BackgroundBlobs />
        <App />
      </RepoProvider>
    </BrowserRouter>
  </StrictMode>,
);