import { createRoot } from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./helpers/context/AuthContext";
import { ToastProvider } from "./helpers/context/ToastContext";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  //<React.StrictMode>
  <AuthProvider>
    <ToastProvider>
      <App />
    </ToastProvider>
  </AuthProvider>

  //</React.StrictMode>
);
