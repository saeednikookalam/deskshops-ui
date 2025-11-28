"use client";

import { createContext, useContext, useState, useEffect, useRef, type PropsWithChildren } from "react";
import { authService, type User } from "@/services/auth";
import { paymentsService } from "@/services/payments";

interface UserContextValue {
  user: User | null;
  balance: number | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  refreshBalance: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasFetched = useRef(false);

  const fetchUser = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchBalance = async () => {
    try {
      const data = await paymentsService.getBalance();
      setBalance(data.balance);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchUser(), fetchBalance()]);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const value: UserContextValue = {
    user,
    balance,
    isLoading,
    refreshUser: fetchUser,
    refreshBalance: fetchBalance,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
