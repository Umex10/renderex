"use server"
import StoreProvider from "../../../redux/StoreProvider";
import { getInitialNotes } from "../../actions/notes";
import { NotesArgs } from "../../types/notesArgs";
import { AuthSetter } from "@/components/auth/AuthSetter";
import { getInitialUserTags } from "@/actions/tags";
import { UserTags } from "../../../redux/slices/tags/tagsSlice";
import { getInitialUser } from "@/actions/user";
import { User } from "@/types/user";
import DashboardContainer from "@/components/layout/DashboardContainer";
import { RootState } from "../../../redux/store";

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
  let initialUserTags: UserTags = { tags: []};
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

    const preloadedState: Partial<RootState> = {
      notesState: {
        activeNote: null,
        notes: initialNotes,
        loadingNotes: false,
        creatingNote: {
          noteId: "",
          status: false
        },
        deletingNote: {
          noteId: "",
          status: false
        }
      },
      tagsState: {
        tags: initialUserTags.tags
      },
      userState: initialUser ?? undefined
    }
  

  return (
    <StoreProvider preloadedState={preloadedState}>
      <AuthSetter>
        <DashboardContainer>{children}</DashboardContainer>
      </AuthSetter>
    </StoreProvider>
  );
}