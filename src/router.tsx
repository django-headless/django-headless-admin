import { Authenticated } from "@refinedev/core";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import App from "@/app";
import { AppShell } from "@/components/app-shell";
import { ForgotPasswordPage } from "@/pages/(auth)/forgot-password";
import { AuthLayout } from "@/pages/(auth)/layout";
import { LoginPage } from "@/pages/(auth)/login";
import { ResetPasswordPage } from "@/pages/(auth)/reset-password";
import { ApiTokensPage } from "@/pages/api-tokens";
import { Dashboard } from "@/pages/dashboard";
import { EditPage } from "@/pages/edit";
import { GroupsPage } from "@/pages/groups";
import { ListPage } from "@/pages/list";
import { MediaLibrary } from "@/pages/media-library";
import { SettingsPage } from "@/pages/settings";
import { UsersPage } from "@/pages/users";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: "login",
            element: <LoginPage />,
          },
          {
            path: "forgot-password",
            element: <ForgotPasswordPage />,
          },
          {
            path: "password-reset/:uid/:token",
            element: <ResetPasswordPage />,
          },
        ],
      },
      {
        element: (
          <Authenticated key="root" appendCurrentPathToQuery>
            <Outlet />
          </Authenticated>
        ),
        children: [
          {
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
