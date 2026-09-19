import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import appRoutes from "./routes/routes";

const router = appRoutes;

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Unable to mount: no element with id "root" found');
}

createRoot(rootElement).render(<RouterProvider router={router} />);
