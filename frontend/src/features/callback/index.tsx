"use client";

import { KeycloakService } from "@/src/services/keycloack";
import { useRouter } from "next/navigation";

import { useEffect } from "react";

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    async function getTokens() {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        const error = params.get("error");
        if (error || !code) return router.push("/login");

        const keycloackService = new KeycloakService();
        await keycloackService.getTokens(code);

        router.push("/game");
      } catch {
        return router.push("/login");
      }
    }

    getTokens();
  }, [router]);

  return <div>Callback</div>;
}
