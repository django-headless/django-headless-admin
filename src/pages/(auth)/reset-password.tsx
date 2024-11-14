import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation, useUpdatePassword } from "@refinedev/core";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useTitle from "@/hooks/useTitle";

export function ResetPasswordPage() {
  const { translate } = useTranslation();
  const { uid, token } = useParams();
  const { mutate: updatePassword } = useUpdatePassword<{
    password: string;
    token: string;
    uid: string;
  }>();
  const formSchema = z
    .object({
      password: z.string().min(8),
      confirm: z.string(),
    })
    .refine((data) => data.password === data.confirm, {
      message: translate("pages.reset_password.no_password_match"),
      path: ["confirm"],
    });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirm: "",
    },
  });

  const submitForm = useCallback((values: z.infer<typeof formSchema>) => {
    updatePassword({
      token,
      uid,
      password: values.password,
    });
  }, []);

  useTitle(translate("pages.reset_password.document_title"));

  return (
    <Form {...form}>
      <h1 className="text-xl font-semibold">
        {translate("pages.reset_password.title")}
      </h1>
      <Card className="w-full">
        <form onSubmit={form.handleSubmit(submitForm)} className="pt-4">
          <CardContent>
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translate("common.password")}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autocomplete="new-password"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {translate("pages.reset_password.confirm_password")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autocomplete="new-password"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button
              className="w-full"
              type="submit"
              loading={form.formState.isSubmitting}
            >
              {translate("pages.reset_password.button")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </Form>
  );
}
