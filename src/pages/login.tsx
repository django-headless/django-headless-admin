import {
  Button,
  Card,
  Checkbox,
  PasswordInput,
  TextInput,
  Title,
} from "@mantine/core";
import { zodResolver } from "@mantine/form";
import { useLogin, useTranslation } from "@refinedev/core";
import { useForm } from "@refinedev/mantine";
import { useCallback } from "react";
import { z } from "zod";

export function LoginPage() {
  const { translate } = useTranslation();
  const { mutate: login } = useLogin();
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      remember: true,
    },
    validate: zodResolver(
      z.object({
        email: z.string().email(),
        password: z.string().min(1),
        remember: z.boolean(),
      }),
    ),
  });

  const submitForm = useCallback((values) => {
    login({ ...values, redirectTo: "/" });
  }, []);

  return (
    <div className="flex items-center justify-center min-h-dvh">
      <div className="flex flex-col items-center gap-8 w-full px-4 max-w-sm">
        <Title order={2}>{translate("pages.login.title")}</Title>
        <Card shadow="sm" withBorder className="w-full">
          <form onSubmit={form.onSubmit(submitForm)} className="space-y-6">
            <div className="space-y-3">
              <TextInput
                type="email"
                label={translate("pages.login.email")}
                {...form.getInputProps("email")}
              />
              <PasswordInput
                label={translate("pages.login.password")}
                {...form.getInputProps("password")}
              />

              <Checkbox
                {...form.getInputProps("remember", { type: "checkbox" })}
                label={translate("pages.login.remember")}
              />
            </div>

            <Button
              fullWidth
              type="submit"
              loading={form.refineCore.formLoading}
            >
              {translate("pages.login.button")}
            </Button>
          </form>
        </Card>
        <div>
          <img
            src="/logo.svg"
            className="h-8 w-auto object-contain select-none"
            alt="Django Headless"
          />
        </div>
      </div>
    </div>
  );
}
