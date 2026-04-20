"use client";

import { KeycloakService } from "@/src/services/keycloack";
import { WalletService } from "@/src/services/wallet";
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
        if (error || !code) return router.push("/");

        const keycloackService = new KeycloakService();
        await keycloackService.getTokens(code);
        const walletService = new WalletService(keycloackService);

        try {
          await walletService.create();
        } catch {
          // Wallet may already exist for the authenticated user.
          console.error("Failed to create wallet");
        }

        router.push("/game");
      } catch {
        return router.push("/");
      }
    }

    getTokens();
  }, [router]);

  return <></>;
}
