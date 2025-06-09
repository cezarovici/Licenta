// src/components/registration/BusinessConfirmationStep.tsx

import React from "react";

const DataRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="flex justify-between border-b border-slate-700 py-3">
    <dt className="text-sm font-medium text-slate-400">{label}</dt>
    <dd className="text-sm text-white text-right break-words">
      {value || "-"}
    </dd>
  </div>
);

interface ConfirmationProps {
  formData: any; // Primim toate datele
}

const BusinessConfirmationStep: React.FC<ConfirmationProps> = ({
  formData,
}) => (
  <div className="space-y-6">
    <h3 className="text-lg font-semibold text-white text-center">
      Please review all details
    </h3>

    {/* Owner Details */}
    <div className="p-4 bg-slate-800 rounded-lg">
      <h4 className="font-bold text-orange-400 mb-2">Owner's Account</h4>
      <dl>
        <DataRow
          label="Full Name"
          value={`${formData.firstName} ${formData.lastName}`}
        />
        <DataRow label="Email" value={formData.email} />
      </dl>
    </div>

    {/* Business Details */}
    <div className="p-4 bg-slate-800 rounded-lg">
      <h4 className="font-bold text-orange-400 mb-2">Business Details</h4>
      <dl>
        <DataRow label="Business Name" value={formData.businessName} />
        <DataRow label="Description" value={formData.businessDescription} />
      </dl>
    </div>

    {/* Location Details */}
    <div className="p-4 bg-slate-800 rounded-lg">
      <h4 className="font-bold text-orange-400 mb-2">Primary Location</h4>
      <dl>
        <DataRow label="Location Name" value={formData.locationName} />
        <DataRow label="Address" value={formData.locationAddress} />
      </dl>
    </div>
  </div>
);

export default BusinessConfirmationStep;
