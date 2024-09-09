import { Authenticated } from "@refinedev/core";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import App from "@/app";
import { AppShell } from "@/components/app-shell";
import { Dashboard } from "@/pages/dashboard";
import { EditPage } from "@/pages/edit";
import { ListPage } from "@/pages/list";
import { LoginPage } from "@/pages/login";
import { MediaLibrary } from "@/pages/media-library";

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
            <Outlet />
          </Authenticated>
        ),
        children: [
          {
            path: "",
            element: <AppShell />,
            children: [
              {
                path: "/",
                element: <Dashboard />,
              },
              {
                path: "content/:resourceId",
                element: <ListPage />,
              },
              {
                path: "media-library",
                element: <MediaLibrary />,
              },
            ],
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
