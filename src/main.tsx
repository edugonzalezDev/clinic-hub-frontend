import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./tailwind.css";
import { BrowserRouter } from "react-router";
import AppRoutes from "./routes";
import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Toaster />
      <AppRoutes />
    </BrowserRouter>
  </React.StrictMode>
);