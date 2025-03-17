import { getUserID } from "@/firebase/AuthService";
import { auth } from "@/firebase/config";

describe("getUserID", () => {
  it("returns the user ID when a user is logged in", () => {
    // Mock the currentUser property with a user object that has a uid
    Object.defineProperty(auth, "currentUser", {
      value: { uid: "user123" },
      configurable: true,
    });

    expect(getUserID()).toBe("user123");
  });

  it("returns null when no user is logged in", () => {
    // Mock the currentUser property as null to simulate logged-out state
    Object.defineProperty(auth, "currentUser", {
      value: null,
      configurable: true,
    });

    expect(getUserID()).toBe(null);
  });

  it("returns null when currentUser is undefined", () => {
    // Test with undefined value
    Object.defineProperty(auth, "currentUser", {
      value: undefined,
      configurable: true,
    });

    expect(getUserID()).toBe(null);
  });

  it("returns null when currentUser has no uid property", () => {
    // Edge case: currentUser exists but has no uid
    Object.defineProperty(auth, "currentUser", {
      value: { email: "test@example.com" }, // Missing uid property
      configurable: true,
    });

    expect(getUserID()).toBe(null);
  });

  it("returns null if no set uid", () => {
    // Edge case: currentUser has empty string uid
    Object.defineProperty(auth, "currentUser", {
      value: { uid: "" },
      configurable: true,
    });

    expect(getUserID()).toBe(null);
  });
});
