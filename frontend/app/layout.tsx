import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/src/shared/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className={cn("font-sans", geist.variable)}>
      <body>{children}</body>
    </html>
  );
}
