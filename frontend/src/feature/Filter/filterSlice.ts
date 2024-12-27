import { createSlice } from "@reduxjs/toolkit";
import { defaultFilter } from "../../constants/filterMap";

const arr: string[] = [];

// Safely parse JSON with a fallback
const safelyParseJSON = (json: string | null, fallback: any) => {
  try {
    return json ? JSON.parse(json) : fallback;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return fallback;
  }
};

const storedActiveFilter = sessionStorage.getItem("activeFilter");
const storedSelectedFilter = sessionStorage.getItem("selectedFilter");

const initialState = {
  selectedFilter: safelyParseJSON(storedSelectedFilter, defaultFilter),
  activeFilter: safelyParseJSON(storedActiveFilter, []),
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.selectedFilter = action.payload;
    },
    clearFilters: (state) => {
      state.selectedFilter = defaultFilter;
    },
    setActiveFilter: (state, action) => {
      const type: string = action.payload;
      if (state.activeFilter.includes(type)) {
        state.activeFilter = state.activeFilter.filter(
          (item: string) => item != type
        );
      } else {
        state.activeFilter = [...state.activeFilter, type];
      }
    },
    setCategory: (state, action) => {
      state.selectedFilter = { ...defaultFilter, category: [action.payload] };
      state.activeFilter = ["category"];
    },
  },
});

export const { setFilters, clearFilters, setActiveFilter, setCategory } =
  filterSlice.actions;

export default filterSlice.reducer;
