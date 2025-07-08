import { Spinner } from "flowbite-react";
import { useLocations } from "../../hooks/useLocation";
import BasicDetailsSection from "../customization-form/BasicDetailSection";
import OperatingHoursSection from "../customization-form/OperatingHourSection";
import FacilitiesSection from "../customization-form/FacilitySection";
import PricingRulesSection from "../customization-form/PriceRulesSection";
import SportConfigsSection from "../customization-form/SportConfigSection";
import { LocationDetailsSection } from "../../../booking/components/LocationDetailSection";

export default function LocationCustomizationPage({
  locationId,
  businessId,
}: {
  locationId: number;
  businessId: number;
}) {
  const { locationDetails: location, isLoading } = useLocations(
    businessId,
    locationId
  );
  {
    if (isLoading || !location) {
      return (
        <div className="text-center p-8">
          <Spinner size="xl" />
        </div>
      );
    }

    console.log(location);

    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">
          Personalizare Locație: {location.name}
        </h1>
        <BasicDetailsSection locationId={locationId} businessId={businessId} />
        <OperatingHoursSection
          locationId={locationId}
          businessId={businessId}
        />
        <FacilitiesSection locationId={locationId} businessId={businessId} />
        <PricingRulesSection locationId={locationId} businessId={businessId} />
        <SportConfigsSection locationId={locationId} businessId={businessId} />
        {/*
          
      
          <PricingRulesSection ... />
          <SportConfigsSection ... />
          <BookingRulesSection ... />
        */}
      </div>
    );
  }
}
