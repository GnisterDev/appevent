import { eventSearch } from "@/firebase/DatabaseService";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/firebase/config";

jest.mock("@/firebase/config", () => ({
  db: {},
}));

describe("eventSearch", () => {
  const mockEvents = [
    {
      title: "Event 1",
      type: "Conference",
      location: "New York",
      startTime: new Date("2023-10-01T10:00:00Z"),
      private: false,
    },
    {
      title: "Event 2",
      type: "Workshop",
      location: "Los Angeles",
      startTime: new Date("2023-10-02T12:00:00Z"),
      private: true,
    },
    {
      title: "Event 3",
      type: "Conference",
      location: "New York",
      startTime: new Date("2023-10-01T15:00:00Z"),
      private: false,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return events matching the name, type, location, and date filters", async () => {
    const mockQuerySnapshot = {
      docs: mockEvents.map(event => ({
        data: () => event,
      })),
    };

    (collection as jest.Mock).mockReturnValue("mockCollection");
    (query as jest.Mock).mockReturnValue("mockQuery");
    (getDocs as jest.Mock).mockResolvedValue(mockQuerySnapshot);
    (where as jest.Mock).mockImplementation(() => "mockWhere");
    (Timestamp.fromDate as jest.Mock).mockImplementation(date => date);

    const searchParams = {
      name: "Event",
      type: "Conference",
      location: "New York",
      date: "2023-10-01",
    };

    const result = await eventSearch(searchParams);

    expect(collection).toHaveBeenCalledWith(db, "events");
    expect(where).toHaveBeenCalledWith("type", "==", "Conference");
    expect(where).toHaveBeenCalledWith("startTime", ">=", expect.any(Date));
    expect(where).toHaveBeenCalledWith("startTime", "<=", expect.any(Date));
    expect(query).toHaveBeenCalledWith(
      "mockCollection",
      "mockWhere",
      "mockWhere",
      "mockWhere"
    );
    expect(getDocs).toHaveBeenCalledWith("mockQuery");

    expect(result).toEqual([
      {
        title: "Event 1",
        type: "Conference",
        location: "New York",
        startTime: new Date("2023-10-01T10:00:00Z"),
        private: false,
      },
      {
        title: "Event 3",
        type: "Conference",
        location: "New York",
        startTime: new Date("2023-10-01T15:00:00Z"),
        private: false,
      },
    ]);
  });

  it("should return an empty array if no events match the filters", async () => {
    const mockQuerySnapshot = {
      docs: [],
    };

    (collection as jest.Mock).mockReturnValue("mockCollection");
    (query as jest.Mock).mockReturnValue("mockQuery");
    (getDocs as jest.Mock).mockResolvedValue(mockQuerySnapshot);

    const searchParams = {
      name: "Nonexistent Event",
      type: "Conference",
      location: "Nowhere",
      date: "2023-10-01",
    };

    const result = await eventSearch(searchParams);

    expect(result).toEqual([]);
  });

  it("should handle errors gracefully", async () => {
    (collection as jest.Mock).mockImplementation(() => {
      throw new Error("Firestore error");
    });

    const searchParams = {
      name: "Event",
      type: "Conference",
      location: "New York",
      date: "2023-10-01",
    };

    await expect(eventSearch(searchParams)).rejects.toThrow("Firestore error");
  });
});
