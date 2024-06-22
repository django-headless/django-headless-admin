import type { DataProvider } from "@refinedev/core";

import { http } from "@/utils/http";

export const dataProvider: DataProvider = {
  async getOne({ resource, id }) {
    const { data } = await http.get(`/${resource}/${id}`);

    return data;
  },
  update: () => {
    throw new Error("Not implemented");
  },
  getList: () => {
    throw new Error("Not implemented");
  },
  create: () => {
    throw new Error("Not implemented");
  },
  deleteOne: () => {
    throw new Error("Not implemented");
  },
  getApiUrl: () => http.defaults.baseURL ?? "",
  // Optional methods:
  // getMany: () => { /* ... */ },
  // createMany: () => { /* ... */ },
  // deleteMany: () => { /* ... */ },
  // updateMany: () => { /* ... */ },
  // custom: () => { /* ... */ },
};
