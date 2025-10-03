import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./tailwind.css";
import App from "./app";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");
async function enableMocking() {
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
      <App />
    </React.StrictMode>
  );
});
