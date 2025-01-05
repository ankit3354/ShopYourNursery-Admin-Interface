import { useDispatch } from "react-redux";
import { createPlantsAdmin } from "@/apiClient/apiClient";
import { addPlantsAdmin, setError, setLoading, } from "../feature/PlantsAdmin/plantsAdminSlice";
export const useAddPlantsAdmin = () => {
    const dispatch = useDispatch();
    const addPlant = async (plantData) => {
        dispatch(setLoading(true));
        try {
            const newPlant = await createPlantsAdmin(plantData); // API call to create the plant
            dispatch(addPlantsAdmin(newPlant)); // Add the new plant to Redux state
            dispatch(setLoading(false)); // Set loading to false after success
            return newPlant; // Return the newly created plant
        }
        catch (error) {
            dispatch(setError(error.message)); // Dispatch error if the request fails
            dispatch(setLoading(false)); // Set loading to false after failure
            throw error; // Rethrow the error for further handling
        }
    };
    return {
        addPlant,
    };
};
