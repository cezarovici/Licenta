// Corespunde LocationResponse din backend
export interface Location {
  id: number; // Folosim number pentru Long-ul din Kotlin
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  businessId: number;
  // Aici vei adăuga și alte câmpuri când vei implementa
  // photoUrls?: string[];
  // operatingHours?: OperatingHour[];
  // facilities?: Facility[];
}

// Corespunde LocationCreateRequest din backend
export interface LocationCreatePayload {
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
}
