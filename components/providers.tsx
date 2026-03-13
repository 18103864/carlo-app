"use client";

import { AuthProvider } from "@/context/auth-context";
import { OrgProvider } from "@/context/org-context";
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
          {children}
        </ThemeProvider>
      </OrgProvider>
    </AuthProvider>
  );
}