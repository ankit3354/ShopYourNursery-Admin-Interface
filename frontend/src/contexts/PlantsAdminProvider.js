import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from "react";
import useDeletePlantsAdmin from ".././hooks/useDeleteFromPlantsAdmin";
import useUpdatePlantsAdmin from "@/hooks/useUpdatePlantsAdmin";
import { useAddPlantsAdmin } from "@/hooks/useAddPlantsAdmin";
import usePlantsAdmin from "@/hooks/usePlantsAdmin";
export const PlantsAdminContext = createContext(undefined);
export default function PlantsAdminProvider({ children, }) {
    const someState = {};
    const handleDeletePlantsAdmin = useDeletePlantsAdmin();
    const handleUpdatePlantsAdmin = useUpdatePlantsAdmin();
    const handleAddPlantsAdmin = useAddPlantsAdmin();
    const { plants, error, isLoading, getPlantById } = usePlantsAdmin();
    return (_jsx(PlantsAdminContext.Provider, { value: {
            someState,
            handleDeletePlantsAdmin,
            handleUpdatePlantsAdmin,
            handleAddPlantsAdmin,
            plants,
            error,
            isLoading,
            getPlantById,
        }, children: children }));
}
export function usePlantsAdminContext() {
    const context = useContext(PlantsAdminContext);
    if (!context) {
        throw new Error("usePlantsAdminContext must be used within a PlantsAdminProvider");
    }
    return context;
}
