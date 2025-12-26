import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/Sidebar"
import StoreProvider from "../../../redux/StoreProvider";
import { cookies } from "next/headers";
import { getInitialNotes } from "../../actions/notes";
import { NotesArgs } from "../../../redux/slices/notesSlice";
import { AuthSetter } from "@/components/AuthSetter";

export default async function Layout({ children }: { children: React.ReactNode }) {

  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  let initialNotes: NotesArgs[] = [];

  if (userId) {
    const result = await getInitialNotes(userId);

    if (result.success && result.data) {
      initialNotes = result.data;
    }
  }

  return (
    <StoreProvider>
      <AuthSetter>
      <SidebarProvider>

        {/* Content in Sidebar */}
        <AppSidebar initialNotes={initialNotes}/>

        <SidebarInset>
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
      </AuthSetter>
    </StoreProvider>
  );
}