import { configureStore } from "@reduxjs/toolkit";
import plantsAdminReducer from "../feature/PlantsAdmin/plantsAdminSlice"; // Update this path
import filterReducer from "../feature/Filter/filterSlice"; // Adjust path as needed
const store = configureStore({
    reducer: {
        plantsAdmin: plantsAdminReducer, // Add the reducer to the store
        filter: filterReducer,
    },
});
export default store;
