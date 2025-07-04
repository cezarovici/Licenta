import type { ClientProfile } from "../../../lib/profile/clientProfile";

interface ClientProfileDisplayProps {
  profile: ClientProfile;
}

export default function ClientProfileDisplay({
  profile,
}: ClientProfileDisplayProps) {
  return (
    <div className="p-6 bg-section border border-standard rounded-lg">
      <div className="flex flex-col items-center sm:flex-row sm:items-start sm:space-x-6">
        <img
          src={profile.profilePhotoUrl}
          alt={`${profile.firstName} ${profile.lastName}`}
          className="w-24 h-24 object-cover rounded-full border-4 border-standard shadow-lg mb-4 sm:mb-0"
        />
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold text-heading">
            {profile.firstName} {profile.lastName}
          </h1>
          <p className="text-md text-secondary mt-1">
            Member ID: {profile.accountId}
          </p>
        </div>
      </div>

      <div className="mt-8 border-t border-standard pt-6">
        <h2 className="text-xl font-semibold text-heading">About Me</h2>
        <p className="text-text-color mt-2 whitespace-pre-wrap">
          {profile.bio || "No biography provided."}
        </p>
      </div>
    </div>
  );
}
