"use client";

import { Sidebar } from "@/components/Layouts/sidebar";
import { Header } from "@/components/Layouts/header";
import { PluginMenuProvider } from "@/contexts/plugin-menu-context";
import type { PropsWithChildren } from "react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { hasToken } from "@/lib/token-manager";
import { authService } from "@/services/auth";
import { UserNameModal } from "@/components/ui/user-name-modal";
import { WelcomeModal } from "@/components/ui/welcome-modal";

export default function PanelLayout({ children }: PropsWithChildren) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showNameModal, setShowNameModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [userName, setUserName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const nameCheckDone = useRef(false);

  useEffect(() => {
    // Check authentication on client side after mount
    const authenticated = hasToken();
    setIsAuthenticated(authenticated);

    if (!authenticated) {
      router.replace('/login');
    }
  }, [router]);

  // Check user name after authentication
  useEffect(() => {
    if (!isAuthenticated || nameCheckDone.current) return;

    const checkUserName = async () => {
      nameCheckDone.current = true;

      try {
        const user = await authService.getCurrentUser();

        // If name is empty or null, show name modal
        if (!user.name || user.name.trim() === '') {
          setShowNameModal(true);
        }
      } catch (error) {
        console.error('Error checking user name:', error);
      }
    };

    checkUserName();
  }, [isAuthenticated]);

  // Handle name submission
  const handleNameSubmit = async (name: string) => {
    setIsProcessing(true);

    try {
      await authService.updateName(name);
      setUserName(name);
      setShowNameModal(false);

      // Show welcome modal after successful save
      setTimeout(() => {
        setShowWelcomeModal(true);
      }, 300);
    } catch (error) {
      console.error('Error updating name:', error);
      // Keep modal open on error so user can try again
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle welcome modal close
  const handleWelcomeClose = () => {
    setShowWelcomeModal(false);
  };

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
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
          <Header />

          <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
            {children}
          </main>
        </div>
      </div>

      {/* Modals */}
      <UserNameModal
        isOpen={showNameModal}
        onSubmit={handleNameSubmit}
        isProcessing={isProcessing}
      />

      <WelcomeModal
        isOpen={showWelcomeModal}
        userName={userName}
        onClose={handleWelcomeClose}
      />
    </PluginMenuProvider>
  );
}