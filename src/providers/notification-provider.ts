import { notifications } from "@mantine/notifications";
import type { NotificationProvider } from "@refinedev/core";

export const notificationProvider: NotificationProvider = {
  open(params) {
    notifications.show({
      id: params.key,
      title: params.message,
      message: params.description,
      color: params.type === "error" ? "red" : "blue",
    });
  },
  close(id) {
    notifications.hide(id);
  },
};
