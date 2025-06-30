export interface Location {
  id: number;
  name: string;
  address: string;
  // Poți folosi un obiect mai complex pentru program dacă ai nevoie
  openingHours: string; // ex: "L-V: 09:00-22:00, S-D: 10:00-20:00"
  photoUrl: string | null;
}
