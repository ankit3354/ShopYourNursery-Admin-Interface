import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setLoading, setError } from "@/feature/PlantsAdmin/plantsAdminSlice";
import { deletePlantsAdmin } from "../apiClient/apiClient";
const useDeletePlantsAdmin = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    return useMutation({
        mutationFn: async (plantId) => deletePlantsAdmin(plantId),
        onMutate: () => {
            dispatch(setLoading(true));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fetchPlants"] });
        },
        onError: (error) => {
            console.error("Error deleting plant:", error);
            dispatch(setError(error.message));
        },
        onSettled: () => {
            dispatch(setLoading(false));
        },
    });
};
export default useDeletePlantsAdmin;
