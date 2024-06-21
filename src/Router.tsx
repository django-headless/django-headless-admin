import { WelcomePage } from "@refinedev/core";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <WelcomePage />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
