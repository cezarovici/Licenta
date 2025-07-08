import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Card, Badge, CalendarIcon } from "flowbite-react";
import { useLocations } from "../../location-management/hooks/useLocation";
import { LocationPhotoGallery } from "./PhotoGallery";
import ProfileHeader from "./ProfileHeader";
import { BookingSection } from "./BookingSection";
import { SparklesIcon } from "lucide-react";

const queryClient = new QueryClient();

export default function LocationPageView({
  locationId,
  businessId,
}: {
  locationId: number;
  businessId: number;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <LocationProfilePageRaw locationId={locationId} businessId={businessId} />
    </QueryClientProvider>
  );
}

function LocationProfilePageRaw({
  locationId,
  businessId,
}: {
  locationId: number;
  businessId: number;
}) {
  const {
    locationDetails,
    isLoading,
    operatingHours,
    facilities,
    sportConfiguration,
  } = useLocations(businessId, locationId);

  console.log(locationDetails, operatingHours, facilities, sportConfiguration);

  if (isLoading) {
    /* ... codul pentru loading ... */
  }
  if (!locationDetails) {
    /* ... codul pentru eroare ... */
  }

  console.log(locationDetails);

  const schedule = operatingHours!.reduce(
    (acc, day) => {
      acc[day.dayOfWeek] =
        `${day.openTime.slice(0, 5)} - ${day.closeTime.slice(0, 5)}`;
      return acc;
    },
    {} as Record<string, string>
  );
  const facilityNames = facilities!.map((f) => f.name);
  const availableSports = sportConfiguration!.map((s) => s.sportName);

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProfileHeader businessId={businessId} locationId={locationId} />
        <LocationPhotoGallery businessId={businessId} locationId={locationId} />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Coloana principală, mai lată */}
          <div className="lg:col-span-2 space-y-8">
            {/* Secțiunea de Sporturi și Facilități */}
            <Card>
              <div className="flex items-center mb-4">
                <SparklesIcon />
                <h2 className="text-2xl font-bold">Sporturi și Facilități</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Sporturi Disponibile
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {availableSports.map((sport) => (
                      <Badge key={sport} color="info" size="sm">
                        {sport}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Facilități</h3>
                  <div className="flex flex-wrap gap-2">
                    {facilityNames.map((facility) => (
                      <Badge key={facility} color="gray" size="sm">
                        {facility}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Secțiunea de Program */}
            <Card>
              <div className="flex items-center">
                <CalendarIcon />
                <h2 className="text-2xl font-bold">Program</h2>
              </div>
              <ul className="space-y-3 mt-4">
                {Object.entries(schedule).map(([day, hours]) => (
                  <li
                    key={day}
                    className="flex justify-between items-center border-b pb-2 last:border-b-0"
                  >
                    <span className="capitalize">{day.toLowerCase()}</span>
                    <span className="font-semibold">{hours}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Coloana secundară (sidebar) - ACUM ESTE LIPICIOASĂ */}
          <aside className="lg:col-span-1">
            {/* Componenta BookingSection nu mai are nevoie de un Card în jurul ei */}
            <BookingSection locationId={locationId} />
          </aside>
        </div>
      </main>
    </div>
  );
}
