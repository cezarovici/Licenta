import { Card, Badge } from "flowbite-react";
import type { components } from "../../../types/api.generated";
import { HiUserGroup, HiOutlineClock, HiTag } from "react-icons/hi";

type Event = components["schemas"]["EventDetailDTO"];

const EventItem = ({ event }: { event: Event }) => {
  const eventDate = new Date(event.eventDateTime).toLocaleDateString("ro-RO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const eventTime = new Date(event.eventDateTime).toLocaleTimeString("ro-RO", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card className="mb-4 transform transition-all hover:scale-[1.02] hover:shadow-md">
      <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
        {event.title}
      </h5>
      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-2">
        <HiOutlineClock className="mr-2 h-5 w-5" />
        <span>
          {eventDate} la {eventTime}
        </span>
      </div>
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center">
          <HiTag className="mr-2 h-5 w-5 text-cyan-600" />
          <Badge color="info">{event.sport}</Badge>
        </div>
        <div className="flex items-center text-gray-700">
          <HiUserGroup className="mr-1 h-5 w-5" />
          <span className="font-semibold">
            {event.participantsCount} / {event.details?.maxParticipants}
          </span>
        </div>
      </div>
    </Card>
  );
};

export const EventList = ({ events }: { events: Event[] }) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">
          Nu sunt evenimente planificate la această locație.
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Fii primul care creează unul!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <EventItem key={event.id} event={event} />
      ))}
    </div>
  );
};
