import React, { useState } from "react";
import { registerClientAccount } from "../../lib/register/register_client";
import { registerBusinessAccount } from "../../lib/register/register_business";
import AccountTypeSelector from "./AccountTypeSelector";
import ClientRegistrationForm from "./client/ClientRegistrationForm";
import ProfileDetailsForm from "./client/ProfileDetailsForm";
import ConfirmationStep from "./client/ConfirmationStep";
import BusinessConfirmationStep from "./business/BusinessConfirmationStep";

const initialFormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  photoUrl: "",
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isLastClientStep = accountType === "CLIENT" && step === 3;

    if (isLastClientStep) {
      setIsLoading(true);
      setError(null);

      try {
        const result = await registerClientAccount(formData);

        console.log("Account created successfully:", result);
        handleNext();
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setIsLoading(false);
      }
    } else if (accountType === "BUSINESS" && step === 4) {
      setIsLoading(true);
      setError(null);
      try {
        const result = await registerBusinessAccount(formData);

        console.log("Business account data:", result);
        handleNext();
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setIsLoading(false);
      }
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
      return (
        <div className="mt-8">
          <button type="submit" className="btn-primary btn-block">
            Confirm & Create Account
          </button>
          <button
            type="button"
            onClick={handleBack}
            className="btn-link-secondary mt-4"
          >
            Back to edit
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between mt-8">
        <button
          type="button"
          onClick={handleBack}
          className="btn-link text-sm"
          disabled={step <= 1}
        >
          &larr; Back
        </button>

        <button type="submit" onClick={handleNext} className="btn-primary">
          Next Step &rarr;
        </button>
      </div>
    );
  };

  return (
    <div className="w-full max-w-lg mx-auto p-8 text-primary animate-fade-in">
      {step === 0 && <AccountTypeSelector onSelectType={handleSelectType} />}

      {step > 0 && (
        <div className="animate-fade-in">
          <div className="text-center mb-8">
            <button
              onClick={goBackToSelection}
              className="btn-link text-sm mb-4"
            >
              &larr; Start Over
            </button>
            <h2 className="text-3xl font-bold">
              Create Your{" "}
              <span style={{ color: "var(--color-accent)" }}>
                {accountType}
              </span>{" "}
              Account
              {accountType === "CLIENT" && (
                <span className="text-lg text-secondary ml-2">
                  (Step {step}/3)
                </span>
              )}
              {accountType === "BUSINESS" && (
                <span className="text-lg text-secondary ml-2">
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
                    <BusinessConfirmationStep
                      formData={formData}
                      handleChange={handleChange}
                    />
                  )}
                  {step === 3 && (
                    <BusinessConfirmationStep formData={formData} />
                  )}
                </>
              )}
            </div>

            {error && (
              <div className="alert-error mt-4">
                <strong>Error:</strong> {error}
              </div>
            )}

            {renderNavigationButtons()}
          </form>
        </div>
      )}
    </div>
  );
}
