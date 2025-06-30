import type { components } from "./api.generated.d.ts";

type Schemas = components["schemas"];

export type Location = Schemas["LocationResponse"];
export type LocationCreatePayload = Schemas["LocationCreateRequestDTO"];
export type LocationUpdatePayload = Schemas["LocationUpdateRequest"];

export type ClientProfile = Schemas["ClientProfileDTO"];
export type ClientRegisterPayload =
  Schemas["CompleteClientRegistrationRequest"];

export type BusinessProfile = Schemas["BusinessDetailDTO"];
export type BusinessRegisterPayload =
  Schemas["CompleteBusinessRegistrationRequest"];

export type BusinessPhoto = Schemas["BusinessPhotoDTO"];
export type LocationSummary = Schemas["LocationSummaryDTO"];
