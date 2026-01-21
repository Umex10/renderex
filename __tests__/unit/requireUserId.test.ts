import { cookies } from "next/headers";
import { requireUserId } from "@/lib/auth/requireUserId";
import { AUTH_ERRORS } from "../../constants/authErrors";

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

describe("requireUserId", () => {
  it("should return the userId when cookie is set", async () => {

    const returnValue = "user-123"
    
    const cookieStore = {
      get: jest.fn().mockReturnValue({value: returnValue})
    };

    (cookies as jest.Mock).mockResolvedValue(cookieStore);

    const result = await requireUserId();

    expect(result).toBe(returnValue);
  });

  it("should throw an error when cookie is not set", async () => {

      const cookieStore = {
      get: jest.fn().mockReturnValue(undefined)
    };

    (cookies as jest.Mock).mockResolvedValue(cookieStore);

    await expect(requireUserId()).rejects.toThrow(AUTH_ERRORS.NOT_AUTHENTICATED);
  });
});