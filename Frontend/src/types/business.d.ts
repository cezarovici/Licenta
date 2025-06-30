// Importăm tipul Location, pe care îl definim mai jos pentru claritate
import type { Location } from "./location";

/**
 * DTO (Data Transfer Object) pentru crearea și actualizarea unui profil de business.
 * Acesta este singurul tip de care ai nevoie pentru operațiunile POST și PUT/PATCH.
 * Corespunde cu `BusinessProfileDto` de pe backend.
 * Toate câmpurile sunt opționale pentru a permite actualizări parțiale (PATCH).
 */
export interface BusinessProfileDto {
  businessName?: string;
  logoUrl?: string | null; // Nume aliniat cu backend-ul: logoUrl
  description?: string | null; // Nume aliniat cu backend-ul: description
  websiteUrl?: string | null; // Câmp adăugat pentru consistență cu backend-ul
  phoneNumber?: string | null; // Nume aliniat cu backend-ul: phoneNumber
  email?: string | null; // Nume aliniat cu backend-ul: email
}

/**
 * Reprezintă profilul complet al unui business, așa cum este returnat de API
 * după un GET reușit. Include date care nu sunt trimise la update,
 * cum ar fi `accountId` și lista de locații.
 */
export interface FullBusinessProfile extends BusinessProfileDto {
  accountId: number;
  locations: Location[];
}

/**
 * Interfață pentru răspunsul API-ului public, care nu necesită autentificare.
 * Este optimizată pentru a afișa informații esențiale într-o listă de business-uri.
 */
export interface PublicBusinessResponse {
  accountId: number;
  businessName: string;
  logoUrl: string | null;
  businessDescription: string | null;
  mainLocation: Location | null;
  otherLocations: Location[];
}
