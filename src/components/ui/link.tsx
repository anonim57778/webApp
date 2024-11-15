"use client";

import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import { useRouter } from "next/navigation";

export interface LinkProps
  extends NextLinkProps,
    React.HTMLAttributes<HTMLAnchorElement> {}

export default function Link(props: LinkProps) {
  const router = useRouter();
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const body = document.querySelector("body");
    body?.classList.add("opacity-0");
    router.push(props.href.toString());

    if (props.onClick) {
      props.onClick(e);
    }

    setTimeout(() => {
      body?.classList.remove("opacity-0");
    }, 100);
  };

  return (
    <NextLink
      {...props}
      onClick={handleClick}
    />
  );
}
