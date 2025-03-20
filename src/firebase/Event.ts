import { DocumentData, DocumentReference, Timestamp } from "firebase/firestore";

export type EventData = {
  eventID: string;
  title: string;
  description: string;
  startTime: Timestamp;
  tags: string[];
  location: string;
  organizer: DocumentReference;
  participants: DocumentReference[];
  private: boolean;

  type: string;
  comments: DocumentReference[];
};

export const DefaultEventData: EventData = {
  eventID: "",
  title: "",
  description: "",
  startTime: null as unknown as Timestamp,
  tags: [],
  location: "",
  organizer: null as unknown as DocumentReference<DocumentData>,
  participants: [],
  private: false,
  type: "",
  comments: [],
};

export type EventContextType = {
  formData: EventData;
  updateFormData: (field: string, value: unknown) => void;
};

export type ListEvents = {
  invited: EventData[];
  registered: EventData[];
  organizer: EventData[];
};

export const DefaultListEvents: ListEvents = {
  invited: [],
  registered: [],
  organizer: [],
};

export const EVENT_GROUPS: Record<string, string[]> = {
  "Faglige arrangementer": [
    "Fagkveld",
    "Workshop",
    "Kurs",
    "Seminar",
    "Konferanse",
    "Foredrag",
    "Bedriftspresentasjon",
    "Kodeklubb",
    "Hackathon",
    "Case-konkurranse",
    "Tech Talk",
    "Study Session",
  ],
  "Sosiale arrangementer": [
    "Fest",
    "Quiz",
    "Spillkveld",
    "LAN",
    "Filmkveld",
    "Hyttetur",
    "Ekskursjon",
    "Utflukt",
    "Idrettsarrangement",
    "Turneringer",
    "Grilling",
    "Julebord",
    "Åpningsfest",
    "Avslutningsfest",
  ],
  "Karriere og nettverk": [
    "Karrieredag",
    "Nettverkskveld",
    "Jobbmesse",
    "CV-workshop",
    "Intervjutrening",
    "Alumni-treff",
    "Mentorprogram",
  ],
  "Formelle arrangementer": [
    "Generalforsamling",
    "Årsmøte",
    "Medlemsmøte",
    "Styremøte",
    "Komitémøte",
    "Avstemming",
    "Valg",
  ],
  "Mat og drikke": [
    "Middagsevent",
    "Pizzakveld",
    "Taco-fredag",
    "Kaffekveld",
    "Vinsmaking",
    "Ølsmaking",
    "Bakedag",
  ],
  Andre: [
    "Dugnad",
    "Velkomstuke",
    "Fadderuke",
    "Rebusløp",
    "Skattejakt",
    "Påskeegg-jakt",
    "Frivilligdag",
    "Innsamlingsaksjon",
    "Stands",
    "Utstilling",
  ],
} as const;
