import type { components } from "../api.generated.d";

type Schemas = components["schemas"];

export type ClientProfile = Schemas["ClientProfileDTO"];

export type ClientRegisterPayload =
  Schemas["CompleteClientRegistrationRequest"];
