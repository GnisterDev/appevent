import { useAuth } from "@/firebase/AuthService";
import { auth } from "@/firebase/config";
import { act, renderHook } from "@testing-library/react";
import { onAuthStateChanged } from "firebase/auth";

describe("useAuth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("initializes with loading true and null user", () => {
    const unsubscribeMock = jest.fn();
    (onAuthStateChanged as jest.Mock).mockReturnValueOnce(unsubscribeMock);

    const { result } = renderHook(() => useAuth());

    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBe(null);
    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.userID).toBe(undefined);

    expect(onAuthStateChanged).toHaveBeenCalledWith(auth, expect.any(Function));
  });

  it("updates state when user signs in", () => {
    const mockUser = { uid: "user123", email: "test@example.com" };
    const unsubscribeMock = jest.fn();

    (onAuthStateChanged as jest.Mock).mockImplementationOnce(
      (auth, callback) => {
        callback(mockUser);
        return unsubscribeMock;
      }
    );

    const { result } = renderHook(() => useAuth());

    expect(result.current.loading).toBe(false);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.userID).toBe("user123");
  });

  it("updates state when user signs out", () => {
    const unsubscribeMock = jest.fn();

    (onAuthStateChanged as jest.Mock).mockImplementationOnce(
      (auth, callback) => {
        callback(null);
        return unsubscribeMock;
      }
    );

    const { result } = renderHook(() => useAuth());

    expect(result.current.loading).toBe(false);
    expect(result.current.user).toBe(null);
    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.userID).toBe(undefined);
  });

  it("unsubscribes from auth state listener on unmount", () => {
    const unsubscribeMock = jest.fn();
    (onAuthStateChanged as jest.Mock).mockReturnValueOnce(unsubscribeMock);

    const { unmount } = renderHook(() => useAuth());
    unmount();

    expect(unsubscribeMock).toHaveBeenCalledTimes(1);
  });

  it("handles multiple auth state changes", () => {
    const mockCallbacks: Array<(user: unknown) => void> = [];
    const unsubscribeMock = jest.fn();

    (onAuthStateChanged as jest.Mock).mockImplementationOnce(
      (auth, callback) => {
        mockCallbacks.push(callback);
        return unsubscribeMock;
      }
    );

    const { result } = renderHook(() => useAuth());

    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBe(null);

    const mockUser = { uid: "user123", email: "test@example.com" };
    act(() => {
      mockCallbacks[0](mockUser);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.userID).toBe("user123");

    act(() => {
      mockCallbacks[0](null);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.user).toBe(null);
    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.userID).toBe(undefined);
  });
});
