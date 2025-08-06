"use client";

import { useAuth } from "@/hooks/useAuth";
import { Permission } from "@/types";
import { ReactNode } from "react";

interface CanProps {
  children: ReactNode;
  permission: Permission;
}

export function Can({ children, permission }: CanProps) {
  const { hasPermission } = useAuth();

  if (!hasPermission(permission)) {
    return null;
  }

  return <>{children}</>;
}
