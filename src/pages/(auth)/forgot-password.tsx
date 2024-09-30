import { zodResolver } from "@hookform/resolvers/zod";
import { useForgotPassword, useTranslation } from "@refinedev/core";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
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

export function ForgotPasswordPage() {
  const { translate } = useTranslation();
  const { mutate: requestPasswordReset } = useForgotPassword();
  const formSchema = z.object({
    email: z.string().email(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const submitForm = useCallback((values: z.infer<typeof formSchema>) => {
    requestPasswordReset(values);
  }, []);

  useTitle(translate("pages.forgot_password.document_title"));

  return (
    <Form {...form}>
      <h1 className="text-xl font-semibold">
        {translate("pages.forgot_password.title")}
      </h1>
      {form.formState.isSubmitSuccessful ? (
        <div className="py-24 px-4 text-center">
          <div className="text-5xl mb-6">📬</div>
          <div className="text-sm">
            {translate("pages.forgot_password.success", {
              email: form.watch("email"),
            })}
          </div>
        </div>
      ) : (
        <Card className="w-full">
          <form onSubmit={form.handleSubmit(submitForm)} className="pt-4">
            <CardContent>
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translate("common.email")}</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
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
                loading={form.formState.isLoading}
              >
                {translate("pages.forgot_password.button")}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </Form>
  );
}
