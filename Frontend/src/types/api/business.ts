import type { components } from "../api.generated.d";

type Schemas = components["schemas"];

export type BusinessProfile = Schemas["BusinessDTO"];

export type BusinessUpdatePayload = Schemas["BusinessUpdateRequest"];

export type BusinessRegisterPayload =
  Schemas["CompleteBusinessRegistrationRequest"];

export type BusinessPhoto = Schemas["BusinessPhotoDTO"];

export type BusinessSummary = Schemas["BusinessSummaryDTO"];
