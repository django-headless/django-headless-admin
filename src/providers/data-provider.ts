import type { DataProvider } from "@refinedev/core";
import * as R from "ramda";
import snakecaseKeys from "snakecase-keys";

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
    const writableVariables = R.omit(meta.readOnlyFields, variables);

    if (meta.hasFileField) {
      return http.patchForm(
        `/${resource}${meta.isSingleton ? "" : `/${id}`}`,
        snakecaseKeys(writableVariables),
      );
    }
    return http.patch(
      `/${resource}${meta.isSingleton ? "" : `/${id}`}`,
      writableVariables,
    );
  },

  async getList({ resource, pagination, filters = [] }) {
    const fields = R.fromPairs(
      filters.map(({ field, value }: any) => [field, value]),
    );
    const { data } = await http.get(`/${resource}`, {
      params: {
        ...fields,
        page: pagination?.current,
        limit: pagination?.pageSize,
        relation_field: "combined",
      },
    });

    return {
      data: data.data,
      total: data.pagination?.count ?? data.data.length,
    };
  },

  async create({ resource, variables, meta }) {
    if (meta.hasFileField) {
      return await http.postForm(`/${resource}`, variables);
    }

    return await http.post(`/${resource}`, variables);
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
