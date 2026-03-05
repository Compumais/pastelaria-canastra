"use client";

import NextLink, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  title: string;
} & LinkProps;

function normalizePath(path: string) {
  if (path === "/") return path;
  return path.endsWith("/") ? path.slice(0, -1) : path;
}

export function Link({ title, ...rest }: Props) {
  const pathname = usePathname();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const current = normalizePath(pathname);
    const target = normalizePath(String(rest.href));

    if (target === "/") {
      setIsActive(current === "/");
    } else {
      setIsActive(current.startsWith(target));
    }
  }, [pathname, rest.href]);

  return (
    <NextLink
      data-active={isActive}
      className="data-[active=true]:text-blue-700 hover:underline hover:text-gray-700 transition-all p-2 rounded"
      {...rest}
    >
      {title}
    </NextLink>
  );
}
