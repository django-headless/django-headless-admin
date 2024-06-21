import "./styles.css";
import "@fontsource-variable/inter";
import "./i18n.ts";

import { HeadlessMantineProvider } from "@mantine/core";
import { Refine } from "@refinedev/core";

import { dataProvider } from "./providers/data-provider";
import { Router } from "./Router";
export default function App() {
  return (
    <Refine dataProvider={dataProvider}>
      <HeadlessMantineProvider>
        <Router />
      </HeadlessMantineProvider>
    </Refine>
  );
}
