import React, { createContext, useContext, ReactNode } from "react";
import useDeletePlantsAdmin from "../hooks/useDeleteFromPlantsAdmin";
import useUpdatePlantsAdmin from "@/hooks/useUpdatePlantsAdmin";
import { useAddPlantsAdmin } from "@/hooks/useAddPlantsAdmin";
import usePlantsAdmin from "@/hooks/usePlantsAdmin";

// Define a type for the context value
type PlantsAdminContextType = {
  someState: object;
  handleDeletePlantsAdmin: ReturnType<typeof useDeletePlantsAdmin>;
  handleUpdatePlantsAdmin: ReturnType<typeof useUpdatePlantsAdmin>;
  handleAddPlantsAdmin: ReturnType<typeof useAddPlantsAdmin>;
  plants: ReturnType<typeof usePlantsAdmin>["plants"];
  error: ReturnType<typeof usePlantsAdmin>["error"];
  isLoading: ReturnType<typeof usePlantsAdmin>["isLoading"];
  getPlantById: ReturnType<typeof usePlantsAdmin>["getPlantById"];
};

// Define the props for the provider
type PlantsAdminProviderProps = {
  children: ReactNode;
};

// Create the context with an explicit type
export const PlantsAdminContext = createContext<PlantsAdminContextType | undefined>(undefined);

export default function PlantsAdminProvider({ children }: PlantsAdminProviderProps) {
  // Hook calls for functionality
  const someState = {}; // Example placeholder state
  const handleDeletePlantsAdmin = useDeletePlantsAdmin();
  const handleUpdatePlantsAdmin = useUpdatePlantsAdmin();
  const handleAddPlantsAdmin = useAddPlantsAdmin();
  const { plants, error, isLoading, getPlantById } = usePlantsAdmin();

  // Provide the context value
  const contextValue: PlantsAdminContextType = {
    someState,
    handleDeletePlantsAdmin,
    handleUpdatePlantsAdmin,
    handleAddPlantsAdmin,
    plants,
    error,
    isLoading,
    getPlantById,
  };

  return (
    <PlantsAdminContext.Provider value={contextValue}>
      {children}
    </PlantsAdminContext.Provider>
  );
}

// Hook to use the context
export function usePlantsAdminContext() {
  const context = useContext(PlantsAdminContext);

  if (!context) {
    throw new Error("usePlantsAdminContext must be used within a PlantsAdminProvider");
  }

  return context;
}
