import React from "react";
import InputField from "../../ui/InputField";

interface BusinessCoreDetailsProps {
  formData: {
    businessName: string;
    businessDescription: string;
  };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const BusinessCoreDetailsForm: React.FC<BusinessCoreDetailsProps> = ({
  formData,
  handleChange,
}) => (
  <>
    <InputField
      id="businessName"
      label="Business Name"
      type="text"
      value={formData.businessName}
      onChange={handleChange}
      placeholder="e.g., 'Victory Arena Sports Club'"
    />
    <div>
      <label
        htmlFor="businessDescription"
        className="block text-sm font-medium text-slate-300"
      >
        Business Description
      </label>
      <div className="mt-1">
        <textarea
          id="businessDescription"
          name="businessDescription"
          rows={4}
          value={formData.businessDescription}
          onChange={handleChange}
          className="block w-full rounded-md bg-slate-700 border-slate-600 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-3 text-white"
          placeholder="Describe your services, facilities, and what makes your business unique."
        />
      </div>
    </div>
  </>
);

export default BusinessCoreDetailsForm;
