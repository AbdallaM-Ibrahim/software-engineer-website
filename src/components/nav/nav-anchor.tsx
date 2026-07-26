"use client";

import Link from "next/link";
import type * as React from "react";

/**
 * A nav destination: next/link for routes, a plain anchor for fragments.
 *
 * Every link in the nav used to be a plain <a>, so clicking Services was a full
 * document reload. The comment justifying that is about the locale switcher —
 * English and Arabic are separate route groups, so that swap is a document
 * navigation either way and correctly stays an anchor. It does not apply within
 * a locale, where `/` and `/services` share a root layout.
 *
 * Fragments stay native. `sectionHref` returns root-absolute hrefs like
 * `/#work`, so on the home page they are same-page anchors that the browser
 * already handles — with smooth scrolling from globals.css and no router
 * involvement to re-run the route. The prefetch and client-navigation win is
 * about route transitions, and `/services` is the only real route link here.
 */
export function NavAnchor({
  href,
  children,
  ...rest
}: { href: string } & React.ComponentProps<"a">) {
  if (href.includes("#")) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}
