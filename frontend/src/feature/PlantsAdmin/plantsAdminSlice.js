import { createSlice } from "@reduxjs/toolkit";
// Initial state for the slice
const initialState = {
    plants: [],
    loading: false,
    error: null,
};
// Creating the slice
const plantsAdminSlice = createSlice({
    name: "plantsAdmin",
    initialState,
    reducers: {
        // Set all plants directly
        setPlantsAdmin: (state, action) => {
            state.plants = action.payload;
        },
        // Add a new plant to the state
        addPlantsAdmin: (state, action) => {
            state.plants.push(action.payload);
        },
        // Remove a plant from the state by its _id
        removeFromPlantsAdmin: (state, action) => {
            state.plants = state.plants.filter((plant) => plant._id !== action.payload);
        },
        updatePlantsAdmin: (state, action) => {
            const updatedPlant = action.payload; // Get the updated plant object
            const findindex = state.plants.findIndex((plant) => plant._id === updatedPlant._id); // Find the plant to update
            if (findindex !== -1) {
                state.plants[findindex] = updatedPlant; // Update the plant at the found index
            }
        },
        // Set loading state (optional)
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        // Set error state (optional)
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});
// Export actions
export const { setPlantsAdmin, addPlantsAdmin, removeFromPlantsAdmin, updatePlantsAdmin, setLoading, setError, } = plantsAdminSlice.actions;
// Export the reducer to use in the store
export default plantsAdminSlice.reducer;
