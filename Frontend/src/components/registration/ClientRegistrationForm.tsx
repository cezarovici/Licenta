import React from "react";
import InputField from "../ui/InputField";

interface RegistrationFormProps {
  formData: any;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const ClientRegistrationForm: React.FC<RegistrationFormProps> = ({
  formData,
  handleChange,
}) => (
  <>
    <InputField
      id="firstName"
      label="First Name"
      type="text"
      value={formData.firstName}
      onChange={handleChange}
    />
    <InputField
      id="lastName"
      label="Last Name"
      type="text"
      value={formData.lastName}
      onChange={handleChange}
    />
    <InputField
      id="email"
      label="Email Address"
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
  </>
);

export default ClientRegistrationForm;
