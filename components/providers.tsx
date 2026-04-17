"use client";

import { AuthProvider } from "@/context/auth-context";
import { OrgProvider } from "@/context/org-context";
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "./theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <OrgProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextTopLoader
            color="var(--primary)"
            height={3}
            showSpinner={false}
          />
          {children}
        </ThemeProvider>
      </OrgProvider>
    </AuthProvider>
  );
}