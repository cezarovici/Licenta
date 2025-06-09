import React from "react";
import InputField from "../ui/InputField";

interface LocationFormProps {
  formData: {
    locationName: string;
    locationAddress: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LocationForm: React.FC<LocationFormProps> = ({
  formData,
  handleChange,
}) => (
  <>
    <InputField
      id="locationName"
      label="Primary Location Name"
      type="text"
      value={formData.locationName}
      onChange={handleChange}
      placeholder="e.g., 'Main Branch'"
    />
    <InputField
      id="locationAddress"
      label="Full Address"
      type="text"
      value={formData.locationAddress}
      onChange={handleChange}
      placeholder="Street, Number, City, County"
    />
  </>
);

export default LocationForm;
