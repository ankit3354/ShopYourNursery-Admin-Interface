import React, { createContext, useContext } from "react";
import useDeletePlantsAdmin from ".././hooks/useDeleteFromPlantsAdmin";
import useUpdatePlantsAdmin from "@/hooks/useUpdatePlantsAdmin";
import { useAddPlantsAdmin } from "@/hooks/useAddPlantsAdmin";
import usePlantsAdmin from "@/hooks/usePlantsAdmin";
type PlantsAdminProviderProps = {
  children: React.ReactNode;
};

export const PlantsAdminContext = createContext<any | undefined>(undefined);

export default function PlantsAdminProvider({
  children,
}: PlantsAdminProviderProps) {
  const someState = {};
  const handleDeletePlantsAdmin = useDeletePlantsAdmin();
  const handleUpdatePlantsAdmin = useUpdatePlantsAdmin();
  const handleAddPlantsAdmin = useAddPlantsAdmin();
  const { plants, error, isLoading, getPlantById } = usePlantsAdmin();

  return (
    <PlantsAdminContext.Provider
      value={{
        someState,
        handleDeletePlantsAdmin,
        handleUpdatePlantsAdmin,
        handleAddPlantsAdmin,
        plants,
        error,
        isLoading,
        getPlantById,
      }}
    >
      {children}
    </PlantsAdminContext.Provider>
  );
}
export function usePlantsAdminContext() {
  const context = useContext(PlantsAdminContext);
  if (!context) {
    throw new Error(
      "usePlantsAdminContext must be used within a PlantsAdminProvider"
    );
  }
  return context;
}
