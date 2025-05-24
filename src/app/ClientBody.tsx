"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    console.log("Current path:", pathname);
  }, [pathname]);

  return <>{children}</>;
}
