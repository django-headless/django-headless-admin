import { Authenticated } from "@refinedev/core";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "@/app";
import { AppShell } from "@/components/app-shell";
import { EditPage } from "@/pages/edit";
import { ListOrSingletonPage } from "@/pages/list-or-singleton";
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
            <AppShell />
          </Authenticated>
        ),
        children: [
          {
            path: "content/:resourceId",
            element: <ListOrSingletonPage />,
          },
          {
            path: "content/:resourceId/:id",
            element: <EditPage />,
          },
        ],
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
