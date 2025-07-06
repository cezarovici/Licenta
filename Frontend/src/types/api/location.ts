import type { components } from "../api.generated.d";

type Schemas = components["schemas"];

export type Location = Schemas["LocationResponse"];
export type LocationDetails = Schemas["LocationDetailDTO"];
export type LocationSummary = Schemas["LocationSummaryDTO"];

// Create
export type LocationCreatePayload = Schemas["LocationCreateRequestDTO"];

// Update
export type LocationUpdatePayload = Schemas["LocationUpdateRequest"];

// Photos
export type LocationPhotoDTO = Schemas["LocationPhotoDTO"];
export type PhotoCreateRequest = Schemas["PhotoCreateRequest"];

// Operating Hours
export type OperatingHour = Schemas["OperatingHourDTO"];
export type UpdateOperatingHoursRequest =
  Schemas["UpdateOperatingHoursRequest"];

// Facilities
export type Facility = Schemas["FacilityDTO"];
export type UpdateFacilityRequest = Schemas["UpdateFacilitiesRequest"];

// --- TIPURI NOI ADĂUGATE ---
export type PricingRule = Schemas["PricingRuleDTO"];
export type AddPricingRuleRequest = Schemas["PricingRuleDTO"]; // Pentru POST

export type SportConfiguration = Schemas["SportConfigurationDTO"];
export type AddSportConfigurationRequest = Schemas["SportConfigurationDTO"]; // Pentru POST

export type BookingRules = Schemas["BookingRulesInfoDTO"];
export type UpdateBookingRulesRequest = Schemas["BookingRulesUpdateRequest"];
