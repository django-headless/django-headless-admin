import type { DataProvider } from "@refinedev/core";
import * as R from "ramda";
import snakecaseKeys from "snakecase-keys";

import { FieldType } from "@/types";
import { http } from "@/utils/http";
import { normalize } from "@/utils/normalize";

export const dataProvider: DataProvider = {
  getApiUrl: () => http.defaults.baseURL ?? "",

  async getOne({ resource, id, meta }) {
    const { data } = await http.get(
      `/${resource}${meta.contentType?.isSingleton ? "" : `/${id}`}`,
    );

    return { data };
  },

  async update({ resource, variables, id, meta }) {
    const isSingleton = meta.contentType.isSingleton;
    const writableVariables = R.omit(
      meta.contentType.admin?.readOnly ?? [],
      variables,
    );
    const fileFields = Object.entries(meta.contentType.fields)
      .filter(([_, value]) => value.type === FieldType.FileField)
      .map(R.head) as string[];

    if (!R.isEmpty(fileFields)) {
      return http.patchForm(`/${resource}${isSingleton ? "" : `/${id}`}`, {
        ...snakecaseKeys(R.pick(fileFields, variables), { deep: false }),
        ...snakecaseKeys(R.omit(fileFields, variables)),
      });
    }
    return http.patch(
      `/${resource}${isSingleton ? "" : `/${id}`}`,
      normalize(writableVariables, meta.contentType),
    );
  },

  async getList({ resource, pagination, filters = [] }) {
    const fields = R.fromPairs(
      filters.map(({ field, value }: any) => [
        value === "<NULL>" ? `${field}__isnull` : field,
        value === "<NULL>" ? true : value,
      ]),
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
    const fileFields = Object.entries(meta.contentType.fields)
      .filter(([_, value]) => value.type === FieldType.FileField)
      .map(R.head) as string[];

    if (!R.isEmpty(fileFields)) {
      return await http.postForm(`/${resource}`, {
        ...snakecaseKeys(R.pick(fileFields, variables), { deep: false }),
        ...snakecaseKeys(R.omit(fileFields, variables)),
      });
    }

    return await http.post(
      `/${resource}`,
      normalize(variables, meta.contentType),
    );
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
