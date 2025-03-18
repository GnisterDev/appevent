import { db } from "@/firebase/config";
import { getEvent } from "@/firebase/DatabaseService";
import { DefaultEventData, EventData } from "@/firebase/Event";
import { doc, getDoc, Timestamp } from "firebase/firestore";

describe("getEvent", () => {
  const mockEventId = "testEventId";
  const mockEventData: EventData = {
    ...DefaultEventData,
    title: "Test Event",
    type: "Private",
    location: "Test Location",
    startTime: Timestamp.now(),
    private: true,
    description: "Test Description",
  };

  it("should return event data when the event exists", async () => {
    (getDoc as jest.Mock).mockResolvedValueOnce({
      exists: () => true,
      data: () => mockEventData,
    });

    const result = await getEvent(mockEventId);

    expect(doc).toHaveBeenCalledWith(db, "events", mockEventId);
    expect(getDoc).toHaveBeenCalledWith(expect.any(Object));
    expect(result).toEqual(mockEventData);
  });

  it("should throw an error when the event does not exist", async () => {
    (getDoc as jest.Mock).mockResolvedValueOnce({
      exists: () => false,
    });

    await expect(getEvent(mockEventId)).rejects.toThrow("Event not found");

    expect(doc).toHaveBeenCalledWith(db, "events", mockEventId);
    expect(getDoc).toHaveBeenCalledWith(expect.any(Object));
  });

  it("should throw an error when there is an issue fetching the event", async () => {
    const mockError = new Error("Firestore error");
    (getDoc as jest.Mock).mockRejectedValueOnce(mockError);

    await expect(getEvent(mockEventId)).rejects.toThrow(mockError);

    expect(doc).toHaveBeenCalledWith(db, "events", mockEventId);
    expect(getDoc).toHaveBeenCalledWith(expect.any(Object));
  });
});
