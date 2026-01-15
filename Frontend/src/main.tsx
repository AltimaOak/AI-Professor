import { createRoot } from "react-dom/client";
import App from "./App.tsx";   // <-- use .jsx extension
import "./index.css";

const rootElement = document.getElementById("root");
createRoot(rootElement).render(<App />);
