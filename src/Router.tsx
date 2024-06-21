import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hammer time!</div>,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
