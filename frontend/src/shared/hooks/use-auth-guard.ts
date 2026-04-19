"use client";

import { KeycloakService } from "@/src/services/keycloack";
import { useRouter } from "next/navigation";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/src/shared/contexts/auth";

export function useAuthGuard() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);

  const keycloak = useMemo(() => new KeycloakService(), []);

  useEffect(() => {
    async function check() {
      const valid = await keycloak.ensureValidToken();

      if (!valid) {
        router.push("/login");
        return;
      }

      refreshUser();
      setLoading(false);
    }

    check();
  }, [router, keycloak, refreshUser]);

  return { loading };
}
