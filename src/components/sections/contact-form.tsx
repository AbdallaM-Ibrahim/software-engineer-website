"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { type ContactValues, contactSchema } from "@/lib/contact-schema";

export function ContactForm() {
  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "", company: "" },
  });

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
        throw new Error(body?.error ?? "Request failed.");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Message sent.", {
        description: "Thanks for reaching out — I'll reply shortly.",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong. Please try again.");
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
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Jane Doe" {...field} />
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="jane@company.com"
                    {...field}
                  />
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
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  placeholder="Tell me about your project…"
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
              <Loader2 className="size-4 animate-spin" /> Sending…
            </>
          ) : (
            <>
              <Send className="size-4" /> Send message
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
