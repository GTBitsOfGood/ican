import React, { createContext, useContext, useState } from "react";

interface FoodContextType {
  selectedFood: string | null;
  setSelectedFood: (food: string) => void;
}

const FoodContext = createContext<FoodContextType | undefined>(undefined);

export const FoodProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedFood, setSelectedFood] = useState<string>("");

  return (
    <FoodContext.Provider value={{ selectedFood, setSelectedFood }}>
      {children}
    </FoodContext.Provider>
  );
};

export const useFood = () => {
  const context = useContext(FoodContext);
  if (context === undefined) {
    throw new Error("useFood must be used within a FoodProvider");
  }
  return context;
};
