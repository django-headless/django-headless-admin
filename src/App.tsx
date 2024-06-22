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
import { useI18nProvider } from "@/providers/i18n-provider";
import { notificationProvider } from "@/providers/notification-provider";
export default function App() {
  const i18nProvider = useI18nProvider();

  return (
    <MantineProvider>
      <Notifications />
      <Refine
        dataProvider={dataProvider}
        authProvider={authProvider}
        routerProvider={routerProvider}
        notificationProvider={notificationProvider}
        i18nProvider={i18nProvider}
      >
        <Outlet />
      </Refine>
    </MantineProvider>
  );
}
