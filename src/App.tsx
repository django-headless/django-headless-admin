import "./styles.css";
import "@fontsource-variable/inter";
import "./i18n.ts";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/react-router-v6";
import { Outlet } from "react-router-dom";

import { authProvider } from "@/providers/auth-provider";
import { dataProvider } from "@/providers/data-provider";
import { notificationProvider } from "@/providers/notification-provider";
export default function App() {
  return (
    <MantineProvider>
      <Notifications />
      <Refine
        dataProvider={dataProvider}
        authProvider={authProvider}
        routerProvider={routerProvider}
        notificationProvider={notificationProvider}
      >
        <Outlet />
      </Refine>
    </MantineProvider>
  );
}
