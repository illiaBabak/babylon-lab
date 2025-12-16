import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "src/root";
import { BrowserRouter } from "react-router-dom";
import "./index.scss";

const rootEl = document.getElementById("root");

if (rootEl) {
  const root = createRoot(rootEl);
  root.render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  );
}
