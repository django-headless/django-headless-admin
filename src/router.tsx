import { Authenticated } from "@refinedev/core";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "@/app";
import { AppShell } from "@/components/app-shell";
import { CollectionEditPage } from "@/pages/collection-edit";
import { ListPage } from "@/pages/list";
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
            path: "collections/:apiId",
            element: <ListPage />,
          },
          {
            path: "collections/:apiId/:id",
            element: <CollectionEditPage />,
          },
        ],
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
