import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VIALKO | Ювелірні прикраси",
  description: "Авторські прикраси з золота, срібла та біжутерія. Доставка по всій Україні Новою Поштою.",
  keywords: "vialko, прикраси, золото, срібло, кільця, сережки, браслети, Україна",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  );
}
