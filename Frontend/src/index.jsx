import { createRoot } from "react-dom/client";
import App from "./App.jsx";   // use .jsx extension
import "./index.css";          // make sure this file exists in src/

const rootElement = document.getElementById("root");
createRoot(rootElement).render(<App />);
