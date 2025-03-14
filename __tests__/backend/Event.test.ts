import { DocumentData, DocumentReference, Timestamp } from "firebase/firestore";
import {
  DefaultEventData,
  EVENT_GROUPS,
  EventData,
} from "../../src/firebase/Event";

describe("EventData", () => {
  it("should have default values in DefaultEventData", () => {
    expect(DefaultEventData).toEqual({
      title: "",
      description: "",
      startTime: null,
      tags: [],
      location: "",
      organizer: null,
      participants: [],
      private: false,
      type: "",
    });
  });

  it("should match the EventData type structure", () => {
    const sampleEvent: EventData = {
      id: "1",
      title: "Sample Event",
      description: "This is a sample event",
      startTime: Timestamp.now(),
      tags: ["sample", "event"],
      location: "Sample Location",
      organizer: {} as DocumentReference<DocumentData>, // Mock DocumentReference
      participants: [{} as DocumentReference<DocumentData>], // Mock DocumentReference array
      private: true,
      type: "Workshop",
    };

    expect(sampleEvent).toBeDefined();
    expect(sampleEvent.title).toBe("Sample Event");
    expect(sampleEvent.private).toBe(true);
  });
});

describe("EVENT_GROUPS", () => {
  it("should contain predefined event groups", () => {
    expect(EVENT_GROUPS).toHaveProperty("Faglige arrangementer");
    expect(EVENT_GROUPS["Faglige arrangementer"]).toContain("Fagkveld");

    expect(EVENT_GROUPS).toHaveProperty("Sosiale arrangementer");
    expect(EVENT_GROUPS["Sosiale arrangementer"]).toContain("Fest");

    expect(EVENT_GROUPS).toHaveProperty("Karriere og nettverk");
    expect(EVENT_GROUPS["Karriere og nettverk"]).toContain("Karrieredag");

    expect(EVENT_GROUPS).toHaveProperty("Formelle arrangementer");
    expect(EVENT_GROUPS["Formelle arrangementer"]).toContain(
      "Generalforsamling"
    );

    expect(EVENT_GROUPS).toHaveProperty("Mat og drikke");
    expect(EVENT_GROUPS["Mat og drikke"]).toContain("Middagsevent");

    expect(EVENT_GROUPS).toHaveProperty("Andre");
    expect(EVENT_GROUPS["Andre"]).toContain("Dugnad");
  });

  it("should have arrays of strings as values", () => {
    Object.values(EVENT_GROUPS).forEach(group => {
      expect(Array.isArray(group)).toBe(true);
      group.forEach(event => {
        expect(typeof event).toBe("string");
      });
    });
  });
});
