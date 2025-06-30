import type { Client } from "./client";
import type { Location } from "./location";
import type { Activity } from "./activity";

export interface Appointment {
  id: number;
  client: Client; // Poți folosi `clientId: number` dacă preferi, dar un obiect complet e mai util în UI
  location: Location;
  activity: Activity;
  startTime: string; // Recomand formatul ISO: "2024-12-25T14:30:00Z"
  endTime: string;
  status: "confirmed" | "pending" | "cancelled";
}
