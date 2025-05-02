
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isRtl, setIsRtl] = useState(true);

  useEffect(() => {
    // Set the direction of the document based on state
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    document.documentElement.lang = isRtl ? "ar" : "en";
    document.body.className = isRtl ? "rtl" : "ltr";
  }, [isRtl]);

  return (
    <SidebarProvider>
      <div className={`min-h-screen flex w-full ${isRtl ? "rtl" : "ltr"}`}>
        <AppSidebar isRtl={isRtl} setIsRtl={setIsRtl} />
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
        <Toaster />
      </div>
    </SidebarProvider>
  );
}
