import { cookies } from "next/headers";

/**
 * Validates if the user is currently authenticated by checking the session cookie.
 * 
 * @throws {Error} If the 'userId' cookie is missing.
 * @returns {Promise<string>} The authenticated user's ID.
 */
export async function requireUserId() {
  const cookieStore = await cookies();
  const userIdCk = cookieStore.get("userId")?.value;

  if (!userIdCk) {
    throw new Error("User is not authenticated!");
  }
  return userIdCk;
}