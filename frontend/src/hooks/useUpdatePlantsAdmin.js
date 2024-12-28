import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePlantsAdmin } from "../apiClient/apiClient";
const useUpdatePlantsAdmin = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, updateData }) => updatePlantsAdmin(id, updateData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["PlantsAdmin"] });
        },
        onError: (error) => {
            console.error("Error updating plant:", error);
        },
    });
};
export default useUpdatePlantsAdmin;
