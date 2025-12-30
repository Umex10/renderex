import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/Sidebar"
import StoreProvider from "../../../redux/StoreProvider";
import { cookies } from "next/headers";
import { getInitialNotes } from "../../actions/notes";
import { NotesArgs } from "../../types/notesArgs";
import { AuthSetter } from "@/components/AuthSetter";
import SelectFormat from "@/components/SelectFormat";
import { getInitialGlobalTags } from "@/actions/tags";
import { Tag, GlobalTags } from "../../../redux/slices/tags/tagsSlice";

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

  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  let initialNotes: NotesArgs[] = [];
  let initialGlobalTags: GlobalTags = {tags: [], userId: userId ?? null};

  if (userId) {
    const notesResult = await getInitialNotes(userId);
    const globalTagsResult = await getInitialGlobalTags(userId);

    if (notesResult.success && notesResult.data) {
      initialNotes = notesResult.data;
    }
    
    if (globalTagsResult &&  globalTagsResult.data) {
      initialGlobalTags = globalTagsResult.data;

    }
  }

  return (
    <StoreProvider>
      <AuthSetter>
        <SidebarProvider>

          {/* Content in Sidebar */}
          <AppSidebar initialNotes={initialNotes} initialGlobalTags={initialGlobalTags} />

          <SidebarInset>
            <header
              className="flex justify-between md:justify-left h-16 shrink-0 items-center gap-2 border-b px-4"
            >
              <SidebarTrigger className="lg:hidden" />

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