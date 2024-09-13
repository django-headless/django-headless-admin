import { Authenticated } from "@refinedev/core";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import App from "@/app";
import { AppShell } from "@/components/app-shell";
import { ApiTokensPage } from "@/pages/api-tokens";
import { Dashboard } from "@/pages/dashboard";
import { EditPage } from "@/pages/edit";
import { GroupsPage } from "@/pages/groups";
import { ListPage } from "@/pages/list";
import { LoginPage } from "@/pages/login";
import { MediaLibrary } from "@/pages/media-library";
import { SettingsPage } from "@/pages/settings";
import { UsersPage } from "@/pages/users";

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
            path: "settings",
            element: <SettingsPage />,
            children: [
              { path: "users", element: <UsersPage /> },
              { path: "groups", element: <GroupsPage /> },
              { path: "api-tokens", element: <ApiTokensPage /> },
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
