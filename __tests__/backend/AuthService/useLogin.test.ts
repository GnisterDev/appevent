import { useLogin } from "@/firebase/AuthService";
import { signInWithEmailAndPassword } from "firebase/auth";

describe("useLogin", () => {
  it("successfully logs in user", async () => {
    const mockUser = { email: "test@test.com" };
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
      user: mockUser,
    });

    const result = await useLogin({
      email: "test@test.com",
      password: "password123",
    });
    expect(result).toEqual({ user: mockUser });
  });

  it("handles login error", async () => {
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(
      new Error("Invalid email or password")
    );

    await expect(
      useLogin({ email: "wrong@test.com", password: "wrongpass" })
    ).rejects.toThrow("Invalid email or password");
  });
});
