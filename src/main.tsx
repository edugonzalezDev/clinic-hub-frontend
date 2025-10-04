import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./tailwind.css";
import { BrowserRouter } from "react-router";
import AppRoutes from "./routes";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");
async function enableMocking() {
  console.log("ENV--->", import.meta.env);
  console.log("ENV PRO--->", import.meta.env.PROD);
  console.log("ENV DEV--->", import.meta.env.DEV);
  // cambiar a modo PROD cuando quieras probar enpoints reales si solo dejar en DEV apra los enpoinst mockeados
  if (import.meta.env.DEV) {
    const { worker } = await import("./mocks/browser");
    console.log("Mocking enabled in development mode");
    return worker.start();
  }
}
enableMocking().then(() => {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </React.StrictMode>
  );
});
