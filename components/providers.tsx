"use client";

import { AuthProvider } from "@/context/auth-context";
import { ThemeProvider } from "./theme-provider";


export default function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>
        <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
            {children}
        </ThemeProvider>
    </AuthProvider>;
}