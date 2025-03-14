import { useLogout } from "@/firebase/AuthService";
import { signOut } from "firebase/auth";

describe("useLogout", () => {
  it("successfully logs out user", async () => {
    (signOut as jest.Mock).mockResolvedValueOnce(undefined);

    const result = await useLogout();
    expect(result).toEqual(undefined);
    expect(signOut).toHaveBeenCalledTimes(1);
  });
});
