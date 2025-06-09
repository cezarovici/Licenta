// src/components/registration/ConfirmationStep.tsx

import React from "react";

interface ConfirmationProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    profilePhotoUrl: string;
    bio: string;
  };
}

const DataRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="flex justify-between border-b border-slate-700 py-3">
    <dt className="text-sm font-medium text-slate-400">{label}</dt>
    <dd className="text-sm text-white text-right break-all">{value || "-"}</dd>
  </div>
);

const ConfirmationStep: React.FC<ConfirmationProps> = ({ formData }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-white text-center">
      Please review your information
    </h3>
    <dl className="p-4 bg-slate-800 rounded-lg">
      <DataRow label="First Name" value={formData.firstName} />
      <DataRow label="Last Name" value={formData.lastName} />
      <DataRow label="Email" value={formData.email} />
      <DataRow label="Profile Photo URL" value={formData.profilePhotoUrl} />
      <DataRow label="Bio" value={formData.bio} />
    </dl>
    <p className="text-xs text-slate-500 text-center pt-2">
      By clicking "Confirm & Create Account", you agree to our terms and
      conditions.
    </p>
  </div>
);

export default ConfirmationStep;
