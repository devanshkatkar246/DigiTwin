import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";   // important → ensure .jsx

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Root element not found");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
