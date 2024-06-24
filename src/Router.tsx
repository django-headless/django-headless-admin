import { Authenticated } from "@refinedev/core";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import App from "@/App";
import { AppShell } from "@/components/app-shell";
import { LoginPage } from "@/pages/login";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "",
        element: (
          <Authenticated key="root" appendCurrentPathToQuery>
            <AppShell>
              <Outlet />
            </AppShell>
          </Authenticated>
        ),
        children: [],
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
