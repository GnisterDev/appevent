import { useLogin, useSignup, useLogout } from "@/firebase/AuthService";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

describe("Firebase Authentication", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  describe("useLogout", () => {
    it("successfully logs out user", async () => {
      (signOut as jest.Mock).mockResolvedValueOnce(undefined);

      const result = await useLogout();
      expect(result).toEqual(undefined);
      expect(signOut).toHaveBeenCalledTimes(1);
    });
  });
});
