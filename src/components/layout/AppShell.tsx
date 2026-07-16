"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { LedgerProvider } from "@/hooks/useLedger";
import Navbar from "./Navbar";
import Footer from "./Footer";
import MobileStepDrawer from "./MobileStepDrawer";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Force immediate scroll to top on page navigation
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <LedgerProvider>
      <Navbar onMenuClick={() => setIsDrawerOpen(true)} />
      
      <MobileStepDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentPhase="profile"
        currentSubStep="personal-info"
        completedSubSteps={[]}
        onNavigate={() => setIsDrawerOpen(false)}
      />
      
      <main className="flex-1 pt-16">
        {children}
        <Footer />
      </main>
    </LedgerProvider>
  );
}
