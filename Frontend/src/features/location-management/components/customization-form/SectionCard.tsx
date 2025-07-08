import type { ReactNode } from "react";
import { Card } from "flowbite-react";

type SectionCardProps = {
  title: string;
  children: ReactNode;
};

export default function SectionCard({ title, children }: SectionCardProps) {
  return (
    <Card>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
    </Card>
  );
}
