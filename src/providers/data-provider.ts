import type { DataProvider } from "@refinedev/core";
import * as R from "ramda";

import { http } from "@/utils/http";

export const dataProvider: DataProvider = {
  async getOne({ resource, id }) {
    const { data } = await http.get(`/${resource}/${id}`);

    return { data };
  },
  update: () => {
    throw new Error("Not implemented");
  },
  async getList({ resource, pagination, filters = [] }) {
    const { data } = await http.get(`/${resource}`, {
      params: {
        page: pagination?.current,
        relations: "string",
        ...R.fromPairs(filters.map(({ field, value }: any) => [field, value])),
      },
    });

    return {
      data: data.data,
      total: data.pagination?.count ?? data.data.length,
    };
  },
  create: () => {
    throw new Error("Not implemented");
  },
  deleteOne: () => {
    throw new Error("Not implemented");
  },
  getApiUrl: () => http.defaults.baseURL ?? "",

  async custom({ url, method = "get", payload, query }) {
    const hasPayload = ["post", "put", "patch"].includes(method);

    if (hasPayload) {
      const { data } = await http[method as "post" | "put" | "patch"](
        url,
        payload,
        { params: query },
      );

      return { data };
    }
    const { data } = await http[method](url, { params: query });

    return { data };
  },
};
