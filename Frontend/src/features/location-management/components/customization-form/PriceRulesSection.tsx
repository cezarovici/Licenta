// features/location-management/components/customization-form/PricingRulesSection.tsx
import { Button, TextInput, Label, Spinner } from "flowbite-react";
import { Trash2 } from "lucide-react";
import { useLocations } from "../../hooks/useLocation";
import SectionCard from "./SectionCard";

export default function PricingRulesSection({
  locationId,
  businessId,
}: {
  locationId: number;
  businessId: number;
}) {
  const { locationDetails, addPricingRule, deletePricingRule, isProcessing } =
    useLocations(businessId, locationId);

  const handleAddRule = () => {
    addPricingRule({
      params: {
        path: { businessAccountId: businessId, locationId: locationId },
      },
      body: {
        /* ... datele din formular ... */
      } as any,
    });
  };

  const handleDeleteRule = (ruleId: number) => {
    deletePricingRule({
      params: {
        path: {
          businessAccountId: businessId,
          locationId: locationId,
          ruleId: ruleId,
        },
      },
    });
  };

  return (
    <SectionCard title="Reguli de Preț">
      <div className="space-y-4">
        {locationDetails?.pricingRules?.map((rule) => (
          <div
            key={rule.id}
            className="flex items-center justify-between p-2 border rounded-lg"
          >
            <span>
              {rule.ruleName} - {rule.pricePerHour} RON
            </span>
            <Button
              size="sm"
              color="failure"
              onClick={() => handleDeleteRule(rule.id!)}
              disabled={isProcessing}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ))}
        {locationDetails?.pricingRules?.length === 0 && (
          <p className="text-gray-500 italic">Nicio regulă de preț adăugată.</p>
        )}
      </div>

      {/* Aici poți adăuga un formular pentru a crea reguli noi */}
      <div className="flex justify-end mt-6">
        <Button onClick={handleAddRule} disabled={isProcessing}>
          Adaugă Regulă Nouă
        </Button>
      </div>
    </SectionCard>
  );
}
