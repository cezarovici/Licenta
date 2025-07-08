import { Tabs, Spinner, Alert, TabItem } from "flowbite-react";
import { HiUserAdd, HiCalendar } from "react-icons/hi";
import { useEvents } from "../../events/hooks/useEvent";
import CreateEventForm from "../../events/components/CreateEventForms";
import { EventList } from "../../events/components/EventList";

interface Props {
  locationId: number;
}

export const BookingSection: React.FC<Props> = ({ locationId }) => {
  const { allEvents, isLoading, isProcessing, statusMessage } = useEvents();

  const locationEvents = allEvents.filter(
    (event: { location: { id: number } }) => event.location.id === locationId
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-1 sticky top-24">
      {statusMessage && (
        <Alert
          color={statusMessage.type === "success" ? "success" : "failure"}
          className="mb-4"
        >
          {statusMessage.message}
        </Alert>
      )}

      <Tabs aria-label="Booking Tabs">
        <TabItem active title="Creează Eveniment" icon={HiUserAdd}>
          <div className="p-4">
            <CreateEventForm locationId={locationId} />
          </div>
        </TabItem>
        <TabItem title="Evenimente Existente" icon={HiCalendar}>
          <div className="p-4 max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center h-48">
                <Spinner size="lg" />
              </div>
            ) : (
              <EventList events={locationEvents} />
            )}
          </div>
        </TabItem>
      </Tabs>
    </div>
  );
};
