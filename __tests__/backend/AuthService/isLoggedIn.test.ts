import { isLoggedIn } from "@/firebase/AuthService";
import { auth } from "@/firebase/config";

describe("isLoggedIn", () => {
  it("returns true when user is logged in", () => {
    // Mock the currentUser property to simulate a logged-in state
    Object.defineProperty(auth, "currentUser", {
      value: { uid: "user123" },
      configurable: true,
    });

    expect(isLoggedIn()).toBe(true);
  });

  it("returns false when user is not logged in", () => {
    // Mock the currentUser property as null to simulate logged-out state
    Object.defineProperty(auth, "currentUser", {
      value: null,
      configurable: true,
    });

    expect(isLoggedIn()).toBe(false);
  });

  it("handles undefined currentUser value", () => {
    // Some implementations might have undefined instead of null
    Object.defineProperty(auth, "currentUser", {
      value: undefined,
      configurable: true,
    });

    expect(isLoggedIn()).toBe(false);
  });

  it("treats falsy values as not logged in", () => {
    // Test with various falsy values
    const falsyValues = [null, undefined, false, 0, ""];

    falsyValues.forEach(value => {
      Object.defineProperty(auth, "currentUser", {
        value,
        configurable: true,
      });

      expect(isLoggedIn()).toBe(false);
    });
  });
});
