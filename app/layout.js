"use client";

import { Inter} from "next/font/google";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { ToastProvider } from "@components/Common/Toast/ToastProvider";

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

axios.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function RootLayout({ children }) {
  const queryClient = new QueryClient();

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/clalogo.ico" />
      </head>
      <body className={`${inter.variable}`}>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            {children}
          </ToastProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
