// src/components/registration/RegistrationWizard.tsx

import React, { useState } from "react";
import AccountTypeSelector from "./AccountTypeSelector";
import ClientRegistrationForm from "./ClientRegistrationForm";
// Importăm noile componente
import BusinessCoreDetailsForm from "./BusinessCoreDetailsForm";
import LocationForm from "./LocationForm";
import BusinessConfirmationStep from "./BusinessConfirmationStep";
// Importăm și componentele pentru client
import ProfileDetailsForm from "./ProfileDetailsForm";
import ConfirmationStep from "./ConfirmationStep";

const initialFormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  profilePhotoUrl: "",
  bio: "",
  businessName: "",
  businessDescription: "",
  locationName: "",
  locationAddress: "",
};

export default function RegistrationWizard() {
  const [step, setStep] = useState(0);
  const [accountType, setAccountType] = useState<"CLIENT" | "BUSINESS" | null>(
    null
  );
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isLastClientStep = accountType === "CLIENT" && step === 3;
    const isLastBusinessStep = accountType === "BUSINESS" && step === 4;

    if (isLastClientStep) {
      console.log("FINAL SUBMIT - CLIENT:", formData);
      alert("Client Account created! (Check console)");
    } else if (isLastBusinessStep) {
      console.log("FINAL SUBMIT - BUSINESS:", formData);
      alert("Business Account created! (Check console)");
    } else {
      handleNext();
    }
  };

  const handleSelectType = (type: "CLIENT" | "BUSINESS") => {
    setAccountType(type);
    setStep(1);
  };

  const goBackToSelection = () => {
    setStep(0);
    setAccountType(null);
    setFormData(initialFormData);
  };

  const renderNavigationButtons = () => {
    const isLastClientStep = accountType === "CLIENT" && step === 3;
    const isLastBusinessStep = accountType === "BUSINESS" && step === 4;

    if (isLastClientStep || isLastBusinessStep) {
      // La ultimul pas, afișăm doar butonul de submit final și un back
      return (
        <div className="mt-8">
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-orange-500 transition-colors"
          >
            Confirm & Create Account
          </button>
          <button
            type="button"
            onClick={handleBack}
            className="w-full text-center mt-4 text-sm text-slate-400 hover:text-white"
          >
            Back to edit
          </button>
        </div>
      );
    }

    // Pentru pașii intermediari
    return (
      <div className="flex items-center justify-between mt-8">
        <button
          type="button"
          onClick={handleBack}
          className="text-sm text-orange-400 hover:text-orange-300 disabled:opacity-50"
          disabled={step <= 1}
        >
          &larr; Back
        </button>

        <button
          type="submit" // Folosim submit pentru a declanșa handleFormSubmit, care va face handleNext()
          className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-orange-500 transition-colors"
        >
          Next Step &rarr;
        </button>
      </div>
    );
  };

  return (
    <div className="w-full max-w-lg mx-auto p-8 text-white animate-fade-in">
      {step === 0 && <AccountTypeSelector onSelectType={handleSelectType} />}

      {step > 0 && (
        <div className="animate-fade-in">
          <div className="text-center mb-8">
            <button
              onClick={goBackToSelection}
              className="text-sm text-orange-400 hover:text-orange-300 mb-4"
            >
              &larr; Start Over
            </button>
            <h2 className="text-3xl font-bold">
              Create Your <span className="text-orange-500">{accountType}</span>{" "}
              Account
              {accountType === "CLIENT" && (
                <span className="text-lg text-slate-400 ml-2">
                  (Step {step}/3)
                </span>
              )}
              {accountType === "BUSINESS" && (
                <span className="text-lg text-slate-400 ml-2">
                  (Step {step}/4)
                </span>
              )}
            </h2>
          </div>

          <form onSubmit={handleFormSubmit}>
            <div className="space-y-6">
              {accountType === "CLIENT" && (
                <>
                  {step === 1 && (
                    <ClientRegistrationForm
                      formData={formData}
                      handleChange={handleChange}
                    />
                  )}
                  {step === 2 && (
                    <ProfileDetailsForm
                      formData={formData}
                      handleChange={handleChange}
                    />
                  )}
                  {step === 3 && <ConfirmationStep formData={formData} />}
                </>
              )}
              {accountType === "BUSINESS" && (
                <>
                  {step === 1 && (
                    <ClientRegistrationForm
                      formData={formData}
                      handleChange={handleChange}
                    />
                  )}
                  {step === 2 && (
                    <BusinessCoreDetailsForm
                      formData={formData}
                      handleChange={handleChange}
                    />
                  )}
                  {step === 3 && (
                    <LocationForm
                      formData={formData}
                      handleChange={handleChange}
                    />
                  )}
                  {step === 4 && (
                    <BusinessConfirmationStep formData={formData} />
                  )}
                </>
              )}
            </div>

            {renderNavigationButtons()}
          </form>
        </div>
      )}
    </div>
  );
}
