// src/components/registration/ProfileDetailsForm.tsx

import React from "react";
import InputField from "../ui/InputField";

interface ProfileDetailsProps {
  formData: {
    profilePhotoUrl: string;
    bio: string;
  };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const ProfileDetailsForm: React.FC<ProfileDetailsProps> = ({
  formData,
  handleChange,
}) => (
  <>
    <InputField
      id="profilePhotoUrl"
      label="Profile Photo URL"
      type="text"
      value={formData.profilePhotoUrl}
      onChange={handleChange}
      placeholder="https://example.com/photo.jpg"
    />
    <div>
      <label htmlFor="bio" className="block text-sm font-medium text-slate-300">
        Short Bio
      </label>
      <div className="mt-1">
        <textarea
          id="bio"
          name="bio"
          rows={4}
          value={formData.bio}
          onChange={handleChange}
          className="block w-full rounded-md bg-slate-700 border-slate-600 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-3 text-white"
          placeholder="Tell us a little about yourself"
        />
      </div>
    </div>
  </>
);

export default ProfileDetailsForm;
