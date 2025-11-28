"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@/contexts/user-context";
import { authService } from "@/services/auth";
import { UserNameModal } from "./user-name-modal";
import { WelcomeModal } from "./welcome-modal";

export function NameChecker() {
  const { user, isLoading, refreshUser } = useUser();
  const [showNameModal, setShowNameModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [userName, setUserName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const nameCheckDone = useRef(false);

  useEffect(() => {
    if (isLoading || nameCheckDone.current || !user) return;

    nameCheckDone.current = true;

    // If name is empty or null, show name modal
    if (!user.name || user.name.trim() === '') {
      setShowNameModal(true);
    }
  }, [user, isLoading]);

  // Handle name submission
  const handleNameSubmit = async (name: string) => {
    setIsProcessing(true);

    try {
      await authService.updateName(name);
      setUserName(name);
      setShowNameModal(false);

      // Refresh user data in context
      await refreshUser();

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

  return (
    <>
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
    </>
  );
}
