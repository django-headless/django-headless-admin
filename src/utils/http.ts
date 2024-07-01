import { HttpError } from "@refinedev/core";
import axios from "axios";

export const http = axios.create({
  baseURL:
    import.meta.env.VITE_HEADLESS_SERVER_URL ||
    (window as any).HEADLESS_SERVER_URL,
});

// Convert axios errors to HttpError on every response.
http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const customError: HttpError = {
      ...error,
      message: error.response?.data?.message,
      statusCode: error.response?.status,
    };

    return Promise.reject(customError);
  },
);
