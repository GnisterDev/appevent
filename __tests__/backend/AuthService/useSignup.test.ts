import { useSignup } from "@/firebase/AuthService";
import { createUserWithEmailAndPassword } from "firebase/auth";

describe("useSignup", () => {
  it("successfully registers user", async () => {
    const mockUser = { email: "new@test.com" };
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
      user: mockUser,
    });

    const result = await useSignup({
      name: "New User",
      email: "new@test.com",
      password: "Password123",
    });
    expect(result).toEqual(undefined);
  });

  it("handles registration error", async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(
      new Error("auth/email-already-in-use")
    );

    await expect(
      useSignup({
        name: "New User",
        email: "existing@test.com",
        password: "Password123",
      })
    ).rejects.toThrow("auth/email-already-in-use");
  });
});
