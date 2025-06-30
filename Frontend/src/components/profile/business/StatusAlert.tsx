import { Alert } from "flowbite-react";

interface StatusMessage {
  type: "success" | "error" | "info" | "warning";
  message: string;
}

interface StatusAlertProps {
  statusMessage: StatusMessage | null;
  className?: string;
}

export default function StatusAlert({
  statusMessage,
  className,
}: StatusAlertProps) {
  if (!statusMessage) {
    return null;
  }

  const colorMap = {
    success: "success",
    error: "failure",
    info: "info",
    warning: "warning",
  };

  return (
    <Alert color={colorMap[statusMessage.type]} className={className}>
      {statusMessage.message}
    </Alert>
  );
}
