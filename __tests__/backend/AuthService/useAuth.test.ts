import { useAuth } from "@/firebase/AuthService";
import { auth } from "@/firebase/config";
import { act, renderHook } from "@testing-library/react";
import { onAuthStateChanged } from "firebase/auth";

describe("useAuth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("initializes with loading true and null user", () => {
    // Mock the auth state listener but don't trigger callback immediately
    const unsubscribeMock = jest.fn();
    (onAuthStateChanged as jest.Mock).mockReturnValueOnce(unsubscribeMock);

    const { result } = renderHook(() => useAuth());

    // Verify initial state
    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBe(null);
    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.userID).toBe(undefined);

    // Verify that onAuthStateChanged was called with correct arguments
    expect(onAuthStateChanged).toHaveBeenCalledWith(auth, expect.any(Function));
  });

  it("updates state when user signs in", () => {
    // Set up mock to trigger callback with user data
    const mockUser = { uid: "user123", email: "test@example.com" };
    const unsubscribeMock = jest.fn();

    (onAuthStateChanged as jest.Mock).mockImplementationOnce(
      (auth, callback) => {
        // Simulate auth state change by calling the callback
        callback(mockUser);
        return unsubscribeMock;
      }
    );

    const { result } = renderHook(() => useAuth());

    // Verify state after auth state change
    expect(result.current.loading).toBe(false);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.userID).toBe("user123");
  });

  it("updates state when user signs out", () => {
    // Set up mock to trigger callback with null (signed out)
    const unsubscribeMock = jest.fn();

    (onAuthStateChanged as jest.Mock).mockImplementationOnce(
      (auth, callback) => {
        // Simulate auth state change by calling the callback with null
        callback(null);
        return unsubscribeMock;
      }
    );

    const { result } = renderHook(() => useAuth());

    // Verify state after auth state change to null
    expect(result.current.loading).toBe(false);
    expect(result.current.user).toBe(null);
    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.userID).toBe(undefined);
  });

  it("unsubscribes from auth state listener on unmount", () => {
    // Set up unsubscribe mock
    const unsubscribeMock = jest.fn();
    (onAuthStateChanged as jest.Mock).mockReturnValueOnce(unsubscribeMock);

    // Render and unmount the hook
    const { unmount } = renderHook(() => useAuth());
    unmount();

    // Verify unsubscribe was called
    expect(unsubscribeMock).toHaveBeenCalledTimes(1);
  });

  it("handles multiple auth state changes", () => {
    // Set up mock that will allow us to trigger callbacks manually
    const mockCallbacks: Array<(user: unknown) => void> = [];
    const unsubscribeMock = jest.fn();

    (onAuthStateChanged as jest.Mock).mockImplementationOnce(
      (auth, callback) => {
        mockCallbacks.push(callback);
        return unsubscribeMock;
      }
    );

    const { result } = renderHook(() => useAuth());

    // Initial state should show loading
    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBe(null);

    // Simulate first auth state change - user logs in
    const mockUser = { uid: "user123", email: "test@example.com" };
    act(() => {
      mockCallbacks[0](mockUser);
    });

    // Verify state after login
    expect(result.current.loading).toBe(false);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.userID).toBe("user123");

    // Simulate second auth state change - user logs out
    act(() => {
      mockCallbacks[0](null);
    });

    // Verify state after logout
    expect(result.current.loading).toBe(false);
    expect(result.current.user).toBe(null);
    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.userID).toBe(undefined);
  });
});
