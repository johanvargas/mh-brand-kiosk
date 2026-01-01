import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import appRoutes from "./routes/routes.jsx";

const router = appRoutes;
createRoot(document.getElementById("root")).render(
      <RouterProvider router={router} hydrationData={<p>Laden</p>} />
);
