import { db } from "@/firebase/config";
import { eventSearch } from "@/firebase/DatabaseService";
import { collection, getDocs, Timestamp, where } from "firebase/firestore";

describe("eventSearch", () => {
  const mockQuerySnapshot = {
    forEach: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (Timestamp.fromDate as jest.Mock) = jest.fn(date => ({
      toDate: () => date,
    }));
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return events matching the search criteria", async () => {
    const mockEvents = [
      { id: "1", name: "Event 1", type: "type1", location: "location1" },
      { id: "2", name: "Event 2", type: "type2", location: "location2" },
    ];

    mockQuerySnapshot.forEach.mockImplementation(callback => {
      mockEvents.forEach(event =>
        callback({ id: event.id, data: () => event })
      );
    });

    (getDocs as jest.Mock).mockResolvedValue(mockQuerySnapshot);

    const result = await eventSearch({
      name: "Event",
      type: "type1",
      location: "location1",
      date: "2023-01-01",
    });

    expect(collection).toHaveBeenCalledWith(db, "events");
    expect(where).toHaveBeenCalledWith("name", ">=", "event");
    expect(where).toHaveBeenCalledWith("name", "<=", "event\uf8ff");
    expect(where).toHaveBeenCalledWith("type", "==", "type1");
    expect(where).toHaveBeenCalledWith("location", "==", "location1");
    expect(Timestamp.fromDate).toHaveBeenCalledTimes(2);
    expect(getDocs).toHaveBeenCalled();
    expect(result).toEqual(mockEvents);
  });

  it("should handle empty search criteria and return all events", async () => {
    const mockEvents = [
      { id: "1", name: "Event 1", type: "type1", location: "location1" },
      { id: "2", name: "Event 2", type: "type2", location: "location2" },
    ];

    mockQuerySnapshot.forEach.mockImplementation(callback => {
      mockEvents.forEach(event =>
        callback({ id: event.id, data: () => event })
      );
    });

    (getDocs as jest.Mock).mockResolvedValue(mockQuerySnapshot);

    const result = await eventSearch({
      name: "",
      type: "",
      location: "",
      date: "",
    });

    expect(collection).toHaveBeenCalledWith(db, "events");
    expect(getDocs).toHaveBeenCalled();
    expect(result).toEqual(mockEvents);
  });

  it("should throw an error if fetching events fails", async () => {
    const mockError = new Error("Failed to fetch events");
    (getDocs as jest.Mock).mockRejectedValue(mockError);

    await expect(
      eventSearch({
        name: "Event",
        type: "type1",
        location: "location1",
        date: "2023-01-01",
      })
    ).rejects.toThrow("Failed to fetch events");

    expect(console.error).toHaveBeenCalledWith(
      "Error searching events:",
      mockError
    );
  });
});
