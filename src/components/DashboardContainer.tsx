"use client"

import React from 'react'

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { UserTagsSubscriber } from './UserTagsSubscriber'
import { NotesSubscriber } from './NotesSubscriber'
import { AppSidebar } from './Sidebar'
import SelectFormat from './SelectFormat'

const DashboardContainer = ({ children }: {children: React.ReactNode}) => {
  return (
    <SidebarProvider>

          <UserTagsSubscriber></UserTagsSubscriber>
          <NotesSubscriber></NotesSubscriber>

          {/* SLIDER (LEFT SIDE) - Content in Sidebar */}
          <AppSidebar/>

          {/* UNDERNEATH SIDEBAR (RIGHT SIDE) - Content of a note */}
          <SidebarInset>
            <header
              className="flex justify-between md:justify-left h-16 shrink-0 items-center gap-2 border-b px-4"
            >
              <SidebarTrigger className="lg:hidden" />

              {/* DOWNLOAD FORMAT */}
              <SelectFormat></SelectFormat>

            </header>

            <main className="flex flex-1 flex-col gap-4 p-4">
              {children}
            </main>
          </SidebarInset>

        </SidebarProvider>
  )
}

export default DashboardContainer
