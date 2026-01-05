"use client"

import React from 'react'

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { UserTagsSubscriber } from './UserTagsSubscriber'
import { NotesSubscriber } from './NotesSubscriber'
import { AppSidebar } from './Sidebar'
import SelectFormat from './SelectFormat'
import { User } from '@/types/user'
import { UserTags } from '../../redux/slices/tags/tagsSlice'
import { NotesArgs } from '@/types/notesArgs'

interface DashboardContainerArgs {
  initialNotes: NotesArgs[],
  initialUserTags: UserTags,
  initialUser: User | null,
  children: React.ReactNode
}

const DashboardContainer = ({ initialNotes, initialUserTags, initialUser, children }: DashboardContainerArgs) => {
  return (
    <SidebarProvider>

          <UserTagsSubscriber initialUserTags={initialUserTags}></UserTagsSubscriber>
          <NotesSubscriber initialNotes={initialNotes}></NotesSubscriber>

          {/* SLIDER (LEFT SIDE) - Content in Sidebar */}
          <AppSidebar
          initialUser={initialUser} />

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
