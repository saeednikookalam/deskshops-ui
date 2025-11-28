"use client";

import { Sidebar } from "@/components/Layouts/sidebar";
import { Header } from "@/components/Layouts/header";
import { PluginMenuProvider } from "@/contexts/plugin-menu-context";
import { UserProvider } from "@/contexts/user-context";
import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { hasToken } from "@/lib/token-manager";
import { NameChecker } from "@/components/ui/name-checker";

export default function PanelLayout({ children }: PropsWithChildren) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check authentication on client side after mount
    const authenticated = hasToken();
    setIsAuthenticated(authenticated);

    if (!authenticated) {
      router.replace('/login');
    }
  }, [router]);

  // Show loading or nothing while checking auth (prevents hydration mismatch)
  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-2 dark:bg-[#020d1a]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render anything if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <PluginMenuProvider>
      <UserProvider>
        <div className="flex min-h-screen">
          <Sidebar />

          <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
            <Header />

            <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
              {children}
            </main>
          </div>
        </div>

        {/* Name checker component */}
        <NameChecker />
      </UserProvider>
    </PluginMenuProvider>
  );
}