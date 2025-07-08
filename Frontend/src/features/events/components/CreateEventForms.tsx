// src/features/events/components/CreateEventForm.tsx
import { useState } from "react";
import { Button, TextInput, Label, Spinner } from "flowbite-react";
import type { components } from "../../../types/api.generated";
import { useEvents } from "../hooks/useEvent";

type EventCreateDTO = components["schemas"]["EventDetailDTO"];

export default function CreateEventForm({
  locationId,
}: {
  locationId: number;
}) {
  const { createEvent, isProcessing } = useEvents();
  const [title, setTitle] = useState("");
  const [sport, setSport] = useState("");
  const [eventDateTime, setEventDateTime] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const body: Omit<EventCreateDTO, "id"> = {
      title,
      sport,
      eventDateTime,
      type: "PUBLIC",
      status: "PLANNED",
      creator: { id: 1, username: "tempUser" },
      location: {
        id: locationId,
        name: "tempLocation",
        address: "tempAddress",
        events: [],
      },
      details: {
        description: "A new event",
        maxParticipants: 10,
        costPerPerson: 0,
        skillLevel: "ALL_LEVELS",
      },
      photos: [],
      participations: [],
      participantsCount: 0,
    };
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl">
      <h3 className="text-2xl font-bold mb-4">Creează un Eveniment Nou</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Titlu Eveniment</Label>
          <TextInput
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="sport">Sport</Label>
          <TextInput
            id="sport"
            value={sport}
            onChange={(e) => setSport(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="eventDateTime">Data și Ora</Label>
          <TextInput
            id="eventDateTime"
            type="datetime-local"
            value={eventDateTime}
            onChange={(e) => setEventDateTime(e.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={isProcessing}>
          {isProcessing ? <Spinner size="sm" /> : "Creează Eveniment"}
        </Button>
      </form>
    </div>
  );
}
