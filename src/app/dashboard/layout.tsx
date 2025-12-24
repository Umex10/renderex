"use client"

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/Sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {


  return (
    <SidebarProvider>

      {/* Content in Sidebar */}
      <AppSidebar />

      <SidebarInset className="transition-all duration-300 ease-in-out"> 
        <header
          className="flex h-16 shrink-0 items-center gap-2 border-b px-4"
        >
          <SidebarTrigger className="lg:hidden" />
          <div className="flex flex-row gap-4 items-center text-lg">
            Text
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4">
          {children}
        </main>
      </SidebarInset>

    </SidebarProvider>
  );
}