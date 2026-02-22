import "./globals.css";
import Navbar from "@/components/Navbar";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>HRMS Lite</title>
        <meta name="description" content="Lightweight HR Management System" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
        <Navbar />
        <main className="max-w-7xl mx-auto px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
