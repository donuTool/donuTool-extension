import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "@/styles/index.css";
import "@/styles/tailwind.css";
import "@/popUpPage/utils/i18n.ts";
import App from "@/popUpPage/App";

createRoot(document.getElementById("root")!).render(
  <HashRouter>
    <App />
  </HashRouter>,
);
