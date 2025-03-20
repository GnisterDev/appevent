import { isLoggedIn } from "@/firebase/AuthService";
import { auth } from "@/firebase/config";

describe("isLoggedIn", () => {
  it("returns true when user is logged in", () => {
    Object.defineProperty(auth, "currentUser", {
      value: { uid: "user123" },
      configurable: true,
    });

    expect(isLoggedIn()).toBe(true);
  });

  it("returns false when user is not logged in", () => {
    Object.defineProperty(auth, "currentUser", {
      value: null,
      configurable: true,
    });

    expect(isLoggedIn()).toBe(false);
  });

  it("handles undefined currentUser value", () => {
    Object.defineProperty(auth, "currentUser", {
      value: undefined,
      configurable: true,
    });

    expect(isLoggedIn()).toBe(false);
  });

  it("treats falsy values as not logged in", () => {
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
