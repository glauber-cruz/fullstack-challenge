"use client";

import { KeycloakService } from "@/src/services/keycloack";
import { useRouter } from "next/navigation";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/src/shared/contexts/auth";

export function useAuthGuard() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);

  const keycloakRef = useRef<KeycloakService | null>(null);

  if (keycloakRef.current === null) {
    keycloakRef.current = new KeycloakService();
  }

  useEffect(() => {
    let active = true;

    async function check() {
      const valid = await keycloakRef.current!.ensureValidToken();

      if (!active) return;

      if (!valid) {
        router.push("/");
        return;
      }

      await refreshUser?.();
      setLoading(false);
    }

    check();

    return () => {
      active = false;
    };
  }, []);

  return { loading };
}
