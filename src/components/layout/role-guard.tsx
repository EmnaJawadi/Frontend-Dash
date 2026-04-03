"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserRole, isAuthenticated, getDefaultRedirectByRole } from "@/src/lib/auth";
import type { UserRole } from "@/src/types/role";

type RoleGuardProps = {
  allowedRoles: UserRole[];
  children: ReactNode;
};

export default function RoleGuard({
  allowedRoles,
  children,
}: RoleGuardProps) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const authenticated = isAuthenticated();
    const role = getUserRole();

    if (!authenticated || !role) {
      router.replace("/login");
      return;
    }

    if (!allowedRoles.includes(role)) {
      router.replace(getDefaultRedirectByRole(role));
      return;
    }

    setIsAllowed(true);
    setIsReady(true);
  }, [allowedRoles, router]);

  if (!isReady) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center p-6 text-sm text-muted-foreground">
        Chargement...
      </div>
    );
  }

  if (!isAllowed) {
    return null;
  }

  return <>{children}</>;
}