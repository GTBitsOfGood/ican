import React, { createContext, useContext, useState } from "react";

interface MedicationContextType {
  medicationIds: Set<string> | null;
  setMedicationIds: (ids: Set<string> | null) => void;
}

const MedicationContext = createContext<MedicationContextType | undefined>(
  undefined,
);

export const MedicationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [medicationIds, setMedicationIds] = useState<Set<string> | null>(null);

  return (
    <MedicationContext.Provider value={{ medicationIds, setMedicationIds }}>
      {children}
    </MedicationContext.Provider>
  );
};

export const useMedications = () => {
  const context = useContext(MedicationContext);
  if (context === undefined) {
    throw new Error("useMedications must be used within a MedicationProvider");
  }
  return context;
};
