import "@/styles.css";
import "@/utils/dayjs";
import "@/utils/i18n";
import "@fontsource-variable/inter";

import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/react-router-v6";
import { Outlet } from "react-router-dom";

import { TooltipProvider } from "@/components/ui/tooltip";
import useTitle from "@/hooks/useTitle";
import { authProvider } from "@/providers/auth-provider";
import { dataProvider } from "@/providers/data-provider";
import { useI18nProvider } from "@/providers/i18n-provider";
import { notificationProvider } from "@/providers/notification-provider";
import { Toaster } from "@/providers/toast-provider";
export default function App() {
  const i18nProvider = useI18nProvider();

  return (
    <Refine
      dataProvider={dataProvider}
      authProvider={authProvider}
      routerProvider={routerProvider}
      notificationProvider={notificationProvider}
      i18nProvider={i18nProvider}
    >
      <TooltipProvider>
        <Toaster />
        <DocumentTitle />
        <Outlet />
      </TooltipProvider>
    </Refine>
  );
}

function DocumentTitle() {
  useTitle();

  return null;
}
