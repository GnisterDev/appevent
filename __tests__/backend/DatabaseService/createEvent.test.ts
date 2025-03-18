import { getUserID } from "@/firebase/AuthService";
import { db } from "@/firebase/config";
import { createEvent } from "@/firebase/DatabaseService";
import { DefaultEventData, EventData } from "@/firebase/Event";
import { collection, doc, Timestamp } from "firebase/firestore";

jest.mock("@/firebase/AuthService", () => ({
  getUserID: jest.fn(),
}));

describe("createEvent", () => {
  const mockUserID = "testUserID";
  const mockEventData: EventData = {
    ...DefaultEventData,
    title: "Test Event",
    type: "Private",
    location: "Test Location",
    startTime: Timestamp.now(),
    private: true,
    description: "Test Description",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if user ID is null", async () => {
    (getUserID as jest.Mock).mockReturnValue(null);

    await expect(createEvent(mockEventData)).rejects.toThrow("User ID is null");
  });

  it("should create an event and return the event ID", async () => {
    (getUserID as jest.Mock).mockReturnValue(mockUserID);
    const mockEventID = "testEventID";
    (doc as jest.Mock).mockReturnValueOnce({ id: mockEventID });
    (doc as jest.Mock).mockReturnValueOnce({ id: mockUserID });

    await expect(createEvent(mockEventData)).resolves.toBe(mockEventID);

    expect(doc).toHaveBeenCalledWith(collection(db, "events"));
    expect(doc).toHaveBeenCalledWith(db, "users", mockUserID);
    // expect(setDoc).toHaveBeenCalledWith(expect.any(Object), mockEventData);
  });
});
