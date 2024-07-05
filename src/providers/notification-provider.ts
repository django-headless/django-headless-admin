import type { NotificationProvider } from "@refinedev/core";

import { dismiss, toast } from "@/hooks/useToast";

export const notificationProvider: NotificationProvider = {
  open(params) {
    toast({
      id: params.key,
      title: params.message,
      description: params.description,
      color: params.type === "error" ? "red" : "blue",
    });
  },
  close(id) {
    dismiss(id);
  },
};
