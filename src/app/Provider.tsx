"use client";

import { ThemeProvider } from "next-themes";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/store";
import { SessionProvider } from "next-auth/react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18next/i18n";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ReduxProvider store={store}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <I18nextProvider i18n={i18n}>
            {children}
          </I18nextProvider>
        </ThemeProvider>
      </ReduxProvider>
    </SessionProvider>
  );
}
