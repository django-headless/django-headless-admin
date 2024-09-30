import { AuthProvider } from "@refinedev/core";
import dayjs from "dayjs";

import { SessionUser } from "@/types";
import { http } from "@/utils/http";

const ACCESS_STORAGE_KEY = "DJANGO_HEADLESS_ACCESS_TOKEN";
const REFRESH_STORAGE_KEY = "DJANGO_HEADLESS_REFRESH_TOKEN";

export const authProvider: AuthProvider = {
  async login({ email, password, remember, redirectTo = "/" }) {
    try {
      const { data } = await http.post<{
        access: string;
        refresh: string;
      }>("/jwt/create", {
        email,
        password,
      });
      if (remember) {
        localStorage.setItem(ACCESS_STORAGE_KEY, data.access);
      } else {
        sessionStorage.setItem(ACCESS_STORAGE_KEY, data.access);
      }
      http.defaults.headers.Authorization = `JWT ${data.access}`;
      return { success: true, redirectTo };
    } catch (e: any) {
      return {
        success: false,
        error: { name: "Login Error", message: e.response?.data.detail },
      };
    }
  },
  async check() {
    const token =
      sessionStorage.getItem(ACCESS_STORAGE_KEY) ||
      localStorage.getItem(ACCESS_STORAGE_KEY);

    if (!token) {
      return {
        authenticated: false,
        redirectTo: "/login",
        logout: true,
      };
    }

    try {
      await http.post("/jwt/verify/", { token });
      http.defaults.headers.Authorization = `JWT ${token}`;

      return {
        authenticated: true,
      };
    } catch (e) {
      return {
        authenticated: false,
        redirectTo: "/login",
        logout: true,
      };
    }
  },
  async logout() {
    sessionStorage.removeItem(ACCESS_STORAGE_KEY);
    localStorage.removeItem(ACCESS_STORAGE_KEY);
    delete http.defaults.headers.Authorization;

    return { success: true, redirectTo: "/login" };
  },
  onError: async (params) => ({}),
  register: async (params) => ({}),
  async forgotPassword(params: { email: string }) {
    try {
      await http.post("/users/reset_password/", { email: params.email });

      return {
        success: true,
      };
    } catch (e: any) {
      return {
        success: false,
      };
    }
  },
  async updatePassword({
    uid,
    token,
    password,
  }: {
    uid: string;
    token: string;
    password: string;
  }) {
    try {
      await http.post("/users/reset_password_confirm/", {
        uid,
        token,
        newPassword: password,
      });

      return { success: true, redirectTo: "/login" };
    } catch (e: any) {}
  },
  getPermissions: async (params) => ({}),
  async getIdentity() {
    try {
      const { data } = await http.get<SessionUser>("/users/me/");
      console.log(`Changing locale to ${data.locale}`);
      dayjs.locale(data.locale);

      console.log(`Changing timezone to ${data.timezone}`);
      dayjs.tz.setDefault(data.timezone);

      return data;
    } catch (e: any) {
      if (e.response.status === 401) {
        return authProvider.logout();
      }
    }
  },
};
