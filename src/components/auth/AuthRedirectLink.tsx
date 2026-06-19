"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import { getAuthToken, getAuthType } from "@/hooks/authStorage";
import { buildLoginRedirectHref } from "@/lib/loginRedirect";

type AuthRedirectLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  loginRedirectTo?: string;
  productSlug?: string;
};

const isModifiedClick = (event: MouseEvent<HTMLAnchorElement>) =>
  event.metaKey ||
  event.ctrlKey ||
  event.shiftKey ||
  event.altKey ||
  event.button !== 0;

const hasUserSession = () =>
  getAuthType() === "user" && Boolean(getAuthToken());

export function AuthRedirectLink({
  href,
  loginRedirectTo,
  productSlug,
  onClick,
  target,
  ...props
}: AuthRedirectLinkProps) {
  const router = useRouter();

  return (
    <Link
      {...props}
      href={href}
      target={target}
      onClick={(event) => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          target === "_blank" ||
          isModifiedClick(event) ||
          hasUserSession()
        ) {
          return;
        }

        event.preventDefault();
        router.push(
          buildLoginRedirectHref({
            redirectTo: loginRedirectTo || href,
            product: productSlug,
          }),
        );
      }}
    />
  );
}
