import React from "react";
import { UserIcon, BusinessIcon } from "../ui/Icons";

interface AccountTypeSelectorProps {
  onSelectType: (type: "CLIENT" | "BUSINESS") => void;
}

const AccountTypeSelector: React.FC<AccountTypeSelectorProps> = ({
  onSelectType,
}) => (
  <div className="text-center">
    <h1 className="text-4xl font-extrabold tracking-tight mb-4">Welcome!</h1>
    <p className="mt-2 text-lg text-slate-400 mb-10">
      First, let us know who you are.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        onClick={() => onSelectType("CLIENT")}
        className="p-6 bg-slate-800 rounded-xl border-2 border-slate-700 hover:border-orange-500 cursor-pointer transition-all duration-200 transform hover:scale-105"
      >
        <UserIcon />
        <h3 className="font-bold text-xl text-white">I'm a Client</h3>
        <p className="text-slate-400 text-sm mt-1">
          I want to find and join sports activities.
        </p>
      </div>
      <div
        onClick={() => onSelectType("BUSINESS")}
        className="p-6 bg-slate-800 rounded-xl border-2 border-slate-700 hover:border-orange-500 cursor-pointer transition-all duration-200 transform hover:scale-105"
      >
        <BusinessIcon />
        <h3 className="font-bold text-xl text-white">I'm a Business</h3>
        <p className="text-slate-400 text-sm mt-1">
          I want to list my venue or services.
        </p>
      </div>
    </div>
  </div>
);

export default AccountTypeSelector;
