import React from "react";
import ReactDOM from "react-dom/client";
import MirrorsModule from "./MirrorsModule"; // Your main component
import "./styles.css"; // Optional: global styles

const rootElement = document.getElementById("root");

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <MirrorsModule />
  </React.StrictMode>
);
