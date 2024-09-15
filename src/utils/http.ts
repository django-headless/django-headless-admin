import axios from "axios";
import * as R from "ramda";

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
    if (error.response) {
      const response = error.response ?? {};

      return Promise.reject({
        ...error,
        message: response.data?.detail ?? "",
        statusCode: response.status,
        errors: !response.data?.detail ? R.map(R.head)(response.data) : {},
      });
    }
    return Promise.reject({ message: error.message });
  },
);
