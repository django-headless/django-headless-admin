import axios from "axios";

export const http = axios.create({
  baseURL:
    import.meta.env.VITE_HEADLESS_SERVER_URL ||
    (window as any).HEADLESS_SERVER_URL,
});
