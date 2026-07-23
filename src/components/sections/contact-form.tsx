"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import {
  CONTACT_CHANNELS,
  INQUIRY_TYPES,
  type ContactValues,
  type InquiryType,
  contactSchema,
} from "@/lib/contact-schema";
import type { FormStrings } from "@/lib/i18n";
import type { Service } from "@/payload-types";

/** Reads ?service= and ?type= so a service page's CTA carries intent through. */
function usePrefill(): { service?: string; inquiryType?: InquiryType } {
  const [prefill, setPrefill] = React.useState<{
    service?: string;
    inquiryType?: InquiryType;
  }>({});

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const service = params.get("service") ?? undefined;
    const type = params.get("type");
    setPrefill({
      service,
      inquiryType: INQUIRY_TYPES.includes(type as InquiryType)
        ? (type as InquiryType)
        : undefined,
    });
  }, []);

  return prefill;
}

export function ContactForm({
  t,
  services,
}: {
  // Just the form strings — the whole Dictionary can't cross into a client
  // component because of its `count`/`copyright` functions.
  t: FormStrings;
  services: Service[];
}) {
  const prefill = usePrefill();

  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      inquiryType: "project",
      service: "",
      phone: "",
      preferredChannel: "email",
      company: "",
    },
  });

  // Query-param prefill lands after mount, so it is applied through reset once
  // read rather than baked into defaultValues.
  const { reset, getValues } = form;
  React.useEffect(() => {
    if (!prefill.service && !prefill.inquiryType) return;
    reset({
      ...getValues(),
      ...(prefill.service ? { service: prefill.service } : {}),
      ...(prefill.inquiryType ? { inquiryType: prefill.inquiryType } : {}),
    });
  }, [prefill, reset, getValues]);

  const mutation = useMutation({
    mutationFn: async (values: ContactValues) => {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        // The route returns a safe, generic message; never surface raw
        // provider errors to the visitor.
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? t.genericError);
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success(t.successTitle, {
        description: t.successBody,
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast.error(error.message || t.genericError);
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        className="space-y-4"
        noValidate
      >
        {/* Honeypot. Hidden from sighted users, taken out of the tab order and
            hidden from assistive tech, so anything typed here is a bot. The
            route silently discards those submissions. */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="contact-company">Company</label>
          <input
            id="contact-company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...form.register("company")}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.name}</FormLabel>
                <FormControl>
                  <Input placeholder={t.namePlaceholder} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.email}</FormLabel>
                <FormControl>
                  {/* Email inputs are a standing target for browser extensions
                      (temp-mail services, password managers) that inject
                      attributes and background-image styles before React
                      hydrates — which React then reports as a hydration
                      mismatch. Nothing here renders differently on server and
                      client, so the warning is purely extension noise. */}
                  <Input
                    type="email"
                    placeholder={t.emailPlaceholder}
                    suppressHydrationWarning
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="inquiryType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.inquiryType}</FormLabel>
                <FormControl>
                  <NativeSelect {...field}>
                    {INQUIRY_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {t.inquiryTypes[type]}
                      </option>
                    ))}
                  </NativeSelect>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {services.length > 0 ? (
            <FormField
              control={form.control}
              name="service"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t.service}{" "}
                    <span className="text-muted-foreground font-normal">
                      ({t.optional})
                    </span>
                  </FormLabel>
                  <FormControl>
                    <NativeSelect {...field}>
                      <option value="">{t.servicePlaceholder}</option>
                      {services
                        .filter((s) => s.slug)
                        .map((s) => (
                          <option key={s.id} value={s.slug as string}>
                            {s.title}
                          </option>
                        ))}
                    </NativeSelect>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t.phone}{" "}
                  <span className="text-muted-foreground font-normal">
                    ({t.optional})
                  </span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    dir="ltr"
                    placeholder={t.phonePlaceholder}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="preferredChannel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t.preferredChannel}{" "}
                  <span className="text-muted-foreground font-normal">
                    ({t.optional})
                  </span>
                </FormLabel>
                <FormControl>
                  <NativeSelect {...field}>
                    {CONTACT_CHANNELS.map((channel) => (
                      <option key={channel} value={channel}>
                        {t.channels[channel]}
                      </option>
                    ))}
                  </NativeSelect>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.message}</FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  placeholder={t.messagePlaceholder}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={mutation.isPending}
          className="w-full sm:w-auto"
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" /> {t.sending}
            </>
          ) : (
            <>
              <Send className="size-4" /> {t.submit}
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
