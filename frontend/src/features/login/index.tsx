"use client";

import { KeycloakService } from "@/src/services/keycloack";
import { Button } from "@/src/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/shared/components/ui/card";

export default function Login() {

  const handleLogin = async() => {
    const keycloackService = new KeycloakService();
    const loginUrl = await keycloackService.generateLoginUrl();
    window.location.href = loginUrl;
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6">
      <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute -bottom-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />

      <Card className="relative z-10 w-full max-w-md border-white/10 bg-white/5 py-0 shadow-2xl backdrop-blur">
        <CardHeader className="p-8 pb-0">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">
            Crash Game
          </p>
          <CardTitle className="mt-4 text-3xl text-white">Bem-vindo</CardTitle>
          <CardDescription className="mt-2 leading-relaxed text-slate-300">
            Entre na sua conta para jogar e se tornar o novo elon musk
            brasileiro.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8 pt-8">
          <Button
            type="button"
            size="lg"
            className="w-full bg-linear-to-r cursor-pointer from-cyan-500 to-indigo-500 text-white hover:brightness-110"
            onClick={handleLogin}
          >
            Entrar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
