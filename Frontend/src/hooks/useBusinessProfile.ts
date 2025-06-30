import { useState, useEffect } from "react";

import type { components } from "../types/api.generated";

type BusinessProfileResponse = components["schemas"]["BusinessDetailDTO"];

export interface BusinessProfileDto {
  businessName: string;
  description: string;
  websiteUrl: string;
  phoneNumber: string;
  logoUrl: string;
}

const initialFormData: BusinessProfileDto = {
  businessName: "",
  description: "",
  websiteUrl: "",
  phoneNumber: "",
  logoUrl: "",
};

import { getCurrentBusinessProfile } from "../lib/business/businessApi";

export const useBusinessProfile = () => {
  const [profile, setProfile] = useState<BusinessProfileResponse | null>(null);
  const [formData, setFormData] = useState<BusinessProfileDto>(initialFormData);

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | "info" | "warning";
    message: string;
  } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setStatusMessage(null);
      try {
        const userProfile = await getCurrentBusinessProfile();
        setProfile(userProfile);

        setFormData({
          businessName: userProfile.businessName ?? "",
          logoUrl: userProfile.logoUrl ?? "",
          description: userProfile.details.description ?? "",
          websiteUrl: userProfile.details.websiteUrl ?? "",
          phoneNumber: userProfile.details.phoneNumber ?? "",
        });
      } catch (err) {
        console.error("Eroare la preluarea profilului:", err);
        setStatusMessage({
          type: "error",
          message:
            err instanceof Error
              ? `Eroare: ${err.message}`
              : "A apărut o eroare necunoscută la preluarea profilului.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return {
    profile,
    formData,
    loading,
    isSubmitting,
    statusMessage,
  };
};
