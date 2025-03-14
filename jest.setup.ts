// jest.setup.ts or tests/setup.ts
import "@testing-library/jest-dom";
import React from "react";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    pathname: "/",
  }),
}));

// Mock Firebase modules
jest.mock("firebase/app", () => {
  const mockApp = { name: "[DEFAULT]" };
  return {
    initializeApp: jest.fn(() => mockApp),
    getApps: jest.fn(() => []),
    getApp: jest.fn(() => mockApp),
  };
});

jest.mock("firebase/auth", () => {
  const mockUser = { uid: "test-user-id", email: "test@example.com" };

  return {
    getAuth: jest.fn(() => ({
      currentUser: null,
      onAuthStateChanged: jest.fn(),
    })),
    onAuthStateChanged: jest.fn((auth, callback) => {
      callback(null);
      return jest.fn();
    }),
    signOut: jest.fn().mockResolvedValue(undefined),
    createUserWithEmailAndPassword: jest.fn(() =>
      Promise.resolve({ user: mockUser })
    ),
    signInWithEmailAndPassword: jest.fn(() =>
      Promise.resolve({ user: mockUser })
    ),
  };
});

jest.mock("firebase/firestore", () => {
  return {
    getFirestore: jest.fn(() => ({})),
    collection: jest.fn(() => ({})),
    doc: jest.fn(() => ({
      get: jest.fn(() =>
        Promise.resolve({
          exists: jest.fn(() => true),
          data: jest.fn(() => ({})),
        })
      ),
    })),
    getDoc: jest.fn(() =>
      Promise.resolve({
        exists: () => true,
        data: () => ({}),
      })
    ),
    setDoc: jest.fn(() => Promise.resolve()),
    updateDoc: jest.fn(() => Promise.resolve()),
    deleteDoc: jest.fn(() => Promise.resolve()),
    getDocs: jest.fn(() =>
      Promise.resolve({
        docs: [],
        forEach: jest.fn(),
      })
    ),
    query: jest.fn(() => ({})),
    where: jest.fn(() => ({})),
    orderBy: jest.fn(() => ({})),
    limit: jest.fn(() => ({})),
    Timestamp: {
      now: jest.fn(() => ({})),
      toDate: jest.fn(() => new Date()),
    },
  };
});

jest.mock("lucide-react", () => ({
  LoaderCircle: jest.fn(() => "Mocked LoaderCircle"),
  Globe: jest.fn(() => "Mocked Globe"),
}));

jest.mock("js-cookie", () => ({
  get: jest.fn(),
  set: jest.fn(),
}));

// This mock is crucial - it prevents Firebase initialization errors
jest.mock(
  "@/firebase/config",
  () => ({
    auth: {
      currentUser: null,
      onAuthStateChanged: jest.fn(),
    },
    db: {},
    app: { name: "[DEFAULT]" },
  }),
  { virtual: true }
);

jest.mock(
  "lucide-react",
  () => ({
    UserMinus: jest.fn(() => null),
  }),
  { virtual: true }
);

jest.mock("lucide-react", () => ({
  UserMinus: function UserMinusMock(props: React.SVGProps<SVGSVGElement>) {
    return React.createElement(
      "div",
      {
        "data-testid": "user-minus-icon",
        ...props,
      },
      "Icon Mock"
    );
  },
}));

// If you have separate auth service files, mock them too
// jest.mock(
//   "@/firebase/AuthService",
//   () => ({
//     useAuth: jest.fn(() => ({
//       user: null,
//       loading: false,
//       isLoggedIn: false,
//       userID: null,
//     })),
//     // useSignup: jest.fn(() => Promise.resolve()),
//     useLogin: jest.fn(() => Promise.resolve()),
//     useLogout: jest.fn(async () => await signOut(auth)),
//     isLoggedIn: jest.fn(() => false),
//     getUserID: jest.fn(() => null),
//     isAdministrator: jest.fn(() => false),
//     isOrganizer: jest.fn(() => false),
//   }),
//   { virtual: true }
// );

// // If you have separate database service files, mock them too
// jest.mock(
//   "@/firebase/DatabaseService",
//   () => ({
//     createUser: jest.fn(() => Promise.resolve()),
//     changeUser: jest.fn(() => Promise.resolve()),
//     deleteUser: jest.fn(() => Promise.resolve()),
//     getUser: jest.fn(() => Promise.resolve()),
//     createEvent: jest.fn(() => Promise.resolve()),
//   }),
//   { virtual: true }
// );
