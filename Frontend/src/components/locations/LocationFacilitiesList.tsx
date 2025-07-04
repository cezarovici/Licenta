import { HiOutlineCheckCircle } from "react-icons/hi";
import type { Facility } from "../../types/api";

export function FacilitiesList({ facilities }: { facilities: Facility[] }) {
  if (!facilities || facilities.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <h6 className="font-semibold text-lg text-heading mb-2">Facilități</h6>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {facilities.map((facility) => (
          <div key={facility.id} className="flex items-center text-secondary">
            <HiOutlineCheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span>{facility.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
