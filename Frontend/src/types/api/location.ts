import type { components } from "../api.generated.d";

type Schemas = components["schemas"];

export type Location = Schemas["LocationResponse"];

export type LocationDetails = Schemas["LocationDetailDTO"];

export type LocationSummary = Schemas["LocationSummaryDTO"];

export type LocationCreatePayload = Schemas["LocationCreateRequestDTO"];

export type LocationUpdatePayload = Schemas["LocationUpdateRequest"];

export type LocationPhoto = Schemas["LocationPhotoDTO"];

export type OperatingHour = Schemas["OperatingHourDTO"];

export type Facility = Schemas["FacilityDTO"];
