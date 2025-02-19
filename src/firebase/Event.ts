import { DocumentReference, Timestamp } from "firebase/firestore";

export type CreateEventRequest = {
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  location: string;
  type: string;
  tags: string[];
};

export type EventData = {
  title: string;
  description: string;
  startTime: Timestamp;
  endTime: Timestamp;
  tags: string[];
  location: string;
  organizer: DocumentReference;
  participants: DocumentReference[];
  private: boolean;

  type: string;
};

export const EVENT_GROUPS = {
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
