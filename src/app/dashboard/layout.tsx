"use server"

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/Sidebar"
import StoreProvider from "../../../redux/StoreProvider";
import { getInitialNotes } from "../../actions/notes";
import { NotesArgs } from "../../types/notesArgs";
import { AuthSetter } from "@/components/AuthSetter";
import SelectFormat from "@/components/SelectFormat";
import { getInitialUserTags } from "@/actions/tags";
import { UserTags } from "../../../redux/slices/tags/tagsSlice";
import { getInitialUser } from "@/actions/user";
import { User } from "@/types/user";

/**
 * The main layout for the dashboard section.
 * Handles server-side fetching of initial notes based on the authenticated user's cookie.
 * Wraps the dashboard content with necessary providers (Redux, Auth, Sidebar).
 * 
 * @async
 * @component
 * @param {Object} args - The component arguments.
 * @param {React.ReactNode} args.children - The child components to render within the layout.
 * @returns {Promise<JSX.Element>} The Dashboard Layout component.
 */
export default async function Layout({ children }: { children: React.ReactNode }) {

  let initialNotes: NotesArgs[] = [];
  let initialUserTags: UserTags = { tags: [], userId: null };
  // Null needed because on fresh registration it may be that the cookie is not set
  let initialUser: User | null = null;


    // Load the notes global tags and the user when the server starts
    const notesResult = await getInitialNotes();
    const userTagsResult = await getInitialUserTags();
    const userResult = await getInitialUser();

    if (notesResult.success && notesResult.data) {
      initialNotes = notesResult.data;
    }

    if (userTagsResult && userTagsResult.data) {
      initialUserTags = userTagsResult.data;
    }

    if (userResult.success && userResult.data) {
      initialUser = userResult.data
    }
  

  return (
    <StoreProvider>
      <AuthSetter>
        <SidebarProvider>

          {/* SLIDER (LEFT SIDE) - Content in Sidebar */}
          <AppSidebar  initialNotes={initialNotes} initialUserTags={initialUserTags}
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
      </AuthSetter>
    </StoreProvider>
  );
}