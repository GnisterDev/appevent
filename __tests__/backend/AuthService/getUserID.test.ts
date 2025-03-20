import { getUserID } from "@/firebase/AuthService";
import { auth } from "@/firebase/config";

describe("getUserID", () => {
  it("returns the user ID when a user is logged in", () => {
    Object.defineProperty(auth, "currentUser", {
      value: { uid: "user123" },
      configurable: true,
    });

    expect(getUserID()).toBe("user123");
  });

  it("returns null when no user is logged in", () => {
    Object.defineProperty(auth, "currentUser", {
      value: null,
      configurable: true,
    });

    expect(getUserID()).toBe(null);
  });

  it("returns null when currentUser is undefined", () => {
    Object.defineProperty(auth, "currentUser", {
      value: undefined,
      configurable: true,
    });

    expect(getUserID()).toBe(null);
  });

  it("returns null when currentUser has no uid property", () => {
    Object.defineProperty(auth, "currentUser", {
      value: { email: "test@example.com" },
      configurable: true,
    });

    expect(getUserID()).toBe(null);
  });

  it("returns null if no set uid", () => {
    Object.defineProperty(auth, "currentUser", {
      value: { uid: "" },
      configurable: true,
    });

    expect(getUserID()).toBe(null);
  });
});
