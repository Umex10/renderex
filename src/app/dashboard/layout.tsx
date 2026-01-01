"use server"

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/Sidebar"
import StoreProvider from "../../../redux/StoreProvider";
import { cookies } from "next/headers";
import { getInitialNotes } from "../../actions/notes";
import { NotesArgs } from "../../types/notesArgs";
import { AuthSetter } from "@/components/AuthSetter";
import SelectFormat from "@/components/SelectFormat";
import { getInitialGlobalTags } from "@/actions/tags";
import { GlobalTags } from "../../../redux/slices/tags/tagsSlice";
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

  // This will tell us if the user is actually logged in
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  let initialNotes: NotesArgs[] = [];
  let initialGlobalTags: GlobalTags = { tags: [], userId: userId ?? null };
  let initialUser: User = {
    createdAt: "",
    email: "",
    role: "",
    uid: "",
    imageURL: "",
    username: ""
  }

  if (userId) {
    // Load the notes global tags and the user when the server starts
    const notesResult = await getInitialNotes(userId);
    const globalTagsResult = await getInitialGlobalTags(userId);
    const userResult = await getInitialUser(userId);

    if (notesResult.success && notesResult.data) {
      initialNotes = notesResult.data;
    }

    if (globalTagsResult && globalTagsResult.data) {
      initialGlobalTags = globalTagsResult.data;
    }

    if (userResult.success && userResult.data) {
      initialUser = userResult.data
    }
  }

  return (
    <StoreProvider>
      <AuthSetter>
        <SidebarProvider>

          {/* SLIDER (LEFT SIDE) - Content in Sidebar */}
          <AppSidebar initialNotes={initialNotes} initialGlobalTags={initialGlobalTags}
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