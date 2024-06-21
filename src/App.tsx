import "./styles.css";
import "@fontsource-variable/inter";

import { HeadlessMantineProvider } from "@mantine/core";

import { Router } from "./Router";

export default function App() {
  return (
    <HeadlessMantineProvider>
      <Router />
    </HeadlessMantineProvider>
  );
}
