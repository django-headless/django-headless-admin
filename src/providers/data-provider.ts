import type { DataProvider } from "@refinedev/core";
import * as R from "ramda";

import { http } from "@/utils/http";

export const dataProvider: DataProvider = {
  getApiUrl: () => http.defaults.baseURL ?? "",

  async getOne({ resource, id, meta }) {
    const { data } = await http.get(
      `/${resource}${meta.isSingleton ? "" : `/${id}`}`,
    );

    return { data };
  },

  async update({ resource, variables, id, meta }) {
    const { data } = await http.patch(
      `/${resource}${meta.isSingleton ? "" : `/${id}`}`,
      variables,
    );

    return { data };
  },

  async getList({ resource, pagination, filters = [] }) {
    console.log(pagination);
    const { data } = await http.get(`/${resource}`, {
      params: {
        page: pagination?.current,
        limit: pagination?.pageSize,
        relations: "string",
        ...R.fromPairs(filters.map(({ field, value }: any) => [field, value])),
      },
    });

    return {
      data: data.data,
      total: data.pagination?.count ?? data.data.length,
    };
  },

  async create({ resource, variables }) {
    const { data } = await http.post(`/${resource}`, variables);

    return { data };
  },

  async deleteOne({ resource, id }) {
    const { data } = await http.delete(`/${resource}/${id}`);

    return data;
  },

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
