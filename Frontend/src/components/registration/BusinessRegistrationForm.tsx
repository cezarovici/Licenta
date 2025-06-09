import React from "react";
import InputField from "../ui/InputField";

interface RegistrationFormProps {
  formData: any;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const BusinessRegistrationForm: React.FC<RegistrationFormProps> = ({
  formData,
  handleChange,
}) => (
  <>
    <h3 className="text-lg font-semibold text-slate-300 border-b border-slate-700 pb-2">
      Owner's Details
    </h3>
    <InputField
      id="firstName"
      label="Your First Name"
      type="text"
      value={formData.firstName}
      onChange={handleChange}
    />
    <InputField
      id="lastName"
      label="Your Last Name"
      type="text"
      value={formData.lastName}
      onChange={handleChange}
    />
    <InputField
      id="email"
      label="Login Email"
      type="email"
      value={formData.email}
      onChange={handleChange}
    />
    <InputField
      id="password"
      label="Password"
      type="password"
      value={formData.password}
      onChange={handleChange}
    />

    <h3 className="text-lg font-semibold text-slate-300 border-b border-slate-700 pb-2 pt-4">
      Business Details
    </h3>
    <InputField
      id="businessName"
      label="Business Name"
      type="text"
      value={formData.businessName}
      onChange={handleChange}
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
          placeholder="What does your business do?"
        />
      </div>
    </div>
  </>
);

export default BusinessRegistrationForm;
