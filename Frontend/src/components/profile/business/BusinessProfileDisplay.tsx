import type { components } from "../../../types/api.generated";
import { Label } from "flowbite-react";

type BusinessProfile = components["schemas"]["BusinessDetailDTO"];
type LocationCreateRequest = components["schemas"]["LocationCreateRequest"];

interface BusinessProfileDisplayProps {
  profile: BusinessProfile;
  accountId: number;
}

export default function BusinessProfileDisplay({
  profile,
}: BusinessProfileDisplayProps) {
  return (
    <>
      <div className="p-6 bg-section border border-standard rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-semibold text-2xl text-heading">
            Detalii Business
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div>
            <Label className="text-primary mb-2 block font-semibold">
              Nume Business:
            </Label>
            <p className="text-text-color">{profile.businessName}</p>
          </div>

          {profile.details?.email && (
            <div>
              <Label className="text-primary mb-2 block font-semibold">
                Email de Contact:
              </Label>
              <p className="text-text-color">{profile.details.email}</p>
            </div>
          )}

          {profile.details?.phoneNumber && (
            <div>
              <Label className="text-primary mb-2 block font-semibold">
                Număr de Telefon:
              </Label>
              <p className="text-text-color">{profile.details.phoneNumber}</p>
            </div>
          )}

          {profile.logoUrl && (
            <div>
              <Label className="text-primary mb-2 block font-semibold">
                Logo
              </Label>
              <img
                src={profile.logoUrl}
                alt="Logo Business"
                className="max-w-24 h-auto rounded-md"
              />
            </div>
          )}
        </div>

        {profile.details?.description && (
          <div>
            <Label className="text-primary mb-2 block font-semibold">
              Descriere Business:
            </Label>
            <p className="text-text-color whitespace-pre-wrap">
              {profile.details.description}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
