import "./globals.css";
import { Geist } from "next/font/google";

import { cn } from "@/src/shared/lib/utils";
import { AuthProvider } from "@/src/shared/contexts/auth";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt"
      className={cn("font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
