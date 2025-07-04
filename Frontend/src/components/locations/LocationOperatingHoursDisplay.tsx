type OperatingHourDTO = {
  dayOfWeek: string; // ex: "Luni"
  openTime: string; // ex: "08:00"
  closeTime: string; // ex: "22:00"
};

export function OperatingHoursDisplay({
  hours,
}: {
  hours: OperatingHourDTO[];
}) {
  if (!hours || hours.length === 0) {
    return null; // Nu afișa nimic dacă nu există program
  }

  return (
    <div className="mt-4">
      <h6 className="font-semibold text-lg text-heading mb-2">Program</h6>
      <ul className="space-y-1 text-secondary">
        {hours.map((hour) => (
          <li
            key={hour.dayOfWeek}
            className="flex justify-between items-center"
          >
            <span>{hour.dayOfWeek}</span>
            <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              {hour.openTime} - {hour.closeTime}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
