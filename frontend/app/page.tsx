import Login from "@/src/features/login";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crash Game | Login",
  description: "Acesse sua conta para entrar no Crash Game.",
};

export default function HomePage() {
  return <Login />;
}
