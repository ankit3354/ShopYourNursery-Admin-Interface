import { useQuery } from "@tanstack/react-query";
import { getPlantsAdmin } from ".././apiClient/apiClient"; // Adjust the import path
const usePlantsAdmin = () => {
    // Define the query key
    const queryKey = ["PlantsAdmin"];
    // Define the query function
    const queryFn = async () => {
        const response = await getPlantsAdmin(); // Call your API function to fetch plants
        return response; // Return the fetched data
    };
    // Use the useQuery hook
    const { data, error, isLoading } = useQuery({
        queryKey,
        queryFn,
        // You can add options here, like staleTime, cacheTime, etc.
    });
    const getPlantById = (id) => {
        return data?.find((plant) => plant._id === id); // Find plant by ID in the fetched data
    };
    return {
        plants: data, // The fetched plants data
        error, // Any error that occurred during fetching
        isLoading, // Loading state
        getPlantById,
    };
};
export default usePlantsAdmin;
