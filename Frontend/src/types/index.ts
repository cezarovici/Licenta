// src/types/index.ts

// --- Tipuri pentru User & Autentificare ---

/**
 * Corespunde cu UserView.kt.
 * Reprezintă profilul public al unui utilizator.
 */
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * Corespunde cu LoginRequest.kt.
 * Datele necesare pentru a autentifica un utilizator.
 */
export interface LoginPayload {
  email: string;
  password: string;
}

/**
 * Corespunde cu DTO-ul de înregistrare din AuthServer.
 * Datele necesare pentru a crea un cont nou.
 */
export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
  authorities: string[]; // ex: ['USER']
}

// --- Tipuri pentru Evenimente & Entități Relaționate ---

/**
 * Corespunde cu enum-ul EventType.kt.
 * Folosim un "string literal type" pentru siguranță.
 */
export type EventType = "PUBLIC" | "PRIVATE";

/**
 * Corespunde cu enum-ul SkillLevel.kt.
 */
export type SkillLevel =
  | "BEGINNER"
  | "INTERMEDIATE"
  | "ADVANCED"
  | "ALL_LEVELS";

/**
 * Corespunde cu DTO-ul imbricat LocationView din EventView.kt.
 */
export interface Location {
  id: number;
  name: string;
  address: string;
}

/**
 * Corespunde cu DTO-ul principal EventView.kt.
 * Acesta este obiectul principal cu care vom lucra în UI pentru a afișa un eveniment.
 * Observă cum refolosim tipurile User și Location definite mai sus.
 */
export interface Event {
  id: number;
  title: string;
  sport: string;
  eventDateTime: string; // Tipurile de dată/timp din backend (LocalDateTime) devin string-uri în JSON (format ISO)
  eventType: EventType;
  creator: User; // Obiect imbricat de tip User
  location: Location; // Obiect imbricat de tip Location
  description?: string; // Proprietățile opționale sunt marcate cu '?'
  maxParticipants?: number;
  currentParticipants: number;
  costPerPerson: number; // Tipurile BigDecimal/Decimal din backend devin `number` în TS
  skillLevel: SkillLevel;
}

/**
 * Corespunde cu CreateEventRequest.kt.
 * Datele necesare pentru a trimite la API la crearea unui eveniment.
 */
export interface CreateEventPayload {
  title: string;
  sport: string;
  eventDateTime: string;
  locationId: number;
  eventType: EventType;
  description?: string;
  maxParticipants?: number;
  costPerPerson?: number;
  skillLevel?: SkillLevel;
}
