import { getUserID } from "@/firebase/AuthService";
import { db } from "@/firebase/config";
import { userSearch } from "@/firebase/DatabaseService";
import { collection, getDocs, where } from "firebase/firestore";

jest.mock("@/firebase/AuthService", () => ({
  getUserID: jest.fn(),
}));

describe("userSearch", () => {
  const mockUserID = "currentUserID";
  const mockUsers = [
    {
      id: "user1",
      data: () => ({ name: "Alice", email: "alice@example.com" }),
    },
    { id: "user2", data: () => ({ name: "Bob", email: "bob@example.com" }) },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (getUserID as jest.Mock).mockReturnValue(mockUserID);
  });

  it("should return an empty array if the search term is empty or only whitespace", async () => {
    const result = await userSearch("   ");
    expect(result).toEqual([]);
    expect(getDocs).not.toHaveBeenCalled();
  });

  it("should query both name and email fields with the search term", async () => {
    const searchTerm = "alice";
    const mockQuerySnapshot = {
      docs: mockUsers,
    };

    (getDocs as jest.Mock).mockResolvedValue(mockQuerySnapshot);

    const result = await userSearch(searchTerm);

    expect(collection).toHaveBeenCalledWith(db, "users");
    expect(where).toHaveBeenCalledWith("name", ">=", searchTerm);
    expect(where).toHaveBeenCalledWith("name", "<=", searchTerm + "\uf8ff");
    expect(where).toHaveBeenCalledWith("email", ">=", searchTerm);
    expect(where).toHaveBeenCalledWith("email", "<=", searchTerm + "\uf8ff");
    expect(getDocs).toHaveBeenCalledTimes(2);
    expect(result).toEqual([
      { name: "Alice", email: "alice@example.com", userID: "user1" },
      { name: "Bob", email: "bob@example.com", userID: "user2" },
    ]);
  });

  it("should filter out the current user from the results", async () => {
    const searchTerm = "bob";
    const mockQuerySnapshot = {
      docs: [
        {
          id: mockUserID,
          data: () => ({ name: "Current User", email: "current@example.com" }),
        },
        ...mockUsers,
      ],
    };

    (getDocs as jest.Mock).mockResolvedValue(mockQuerySnapshot);

    const result = await userSearch(searchTerm);

    expect(result).toEqual([
      { name: "Alice", email: "alice@example.com", userID: "user1" },
      { name: "Bob", email: "bob@example.com", userID: "user2" },
    ]);
  });

  it("should return an empty array if no users match the search term", async () => {
    const searchTerm = "nonexistent";
    const mockQuerySnapshot = {
      docs: [],
    };

    (getDocs as jest.Mock).mockResolvedValue(mockQuerySnapshot);

    const result = await userSearch(searchTerm);

    expect(result).toEqual([]);
  });

  it("should handle errors gracefully and throw them", async () => {
    const searchTerm = "error";
    (getDocs as jest.Mock).mockRejectedValue(new Error("Firestore error"));

    await expect(userSearch(searchTerm)).rejects.toThrow("Firestore error");
  });
});
