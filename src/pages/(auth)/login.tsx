import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin, useTranslation } from "@refinedev/core";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useTitle from "@/hooks/useTitle";

export function LoginPage() {
  const { translate } = useTranslation();
  const { mutate: login } = useLogin();
  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
    remember: z.boolean(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: true,
    },
  });

  const submitForm = useCallback((values: z.infer<typeof formSchema>) => {
    login({ ...values, redirectTo: "/" });
  }, []);

  useTitle(translate("pages.login.document_title"));

  return (
    <Form {...form}>
      <h1 className="text-xl font-semibold">
        {translate("pages.login.title")}
      </h1>
      <Card className="w-full">
        <form onSubmit={form.handleSubmit(submitForm)} className="pt-4">
          <CardContent>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translate("pages.login.email")}</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translate("pages.login.password")}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormDescription>
                      <Link to="/forgot-password" className="hover:underline">
                        {translate("pages.login.forgot_password")}
                      </Link>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="remember"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>{translate("pages.login.remember")}</FormLabel>

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
              {translate("pages.login.button")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </Form>
  );
}
