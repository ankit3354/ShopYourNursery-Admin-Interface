import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import FilterCard from "./FilterCard";
import { useDispatch, useSelector } from "react-redux";
import { setActiveFilter } from "../../feature/Filter/filterSlice";
import { useEffect } from "react";
// import { filterTypes } from "../../constants/filterMap";
export default function Filter({ selectedFilter, filterMap, handleFilter, handleClear, }) {
    const dispatch = useDispatch();
    const { activeFilter } = useSelector((state) => state.filter);
    const handleActiveFilter = (type) => {
        dispatch(setActiveFilter(type));
    };
    useEffect(() => {
        sessionStorage.setItem("activeFilter", JSON.stringify(activeFilter));
    }, [activeFilter]);
    return (_jsxs("div", { className: "bg-[#F3F3F3] border border-[#D7D7D7] rounded-[0.625rem] w-[22rem] h-fit pb-10 flex flex-col gap-y-5 shrink-0", children: [_jsxs("div", { className: "flex justify-between w-full  items-center px-5 mt-12 mb-10", children: [_jsx("h2", { className: "font-Poppins font-semibold text-xl", children: "Filter" }), _jsx("button", { onClick: () => handleClear(), className: "font-Poppins font-medium text-[#358406] bg-[#FFFFFF] border border-[#358406] rounded-[0.625rem] py-2 px-4", children: "Clear All" })] }), filterMap?.map((filter, index) => (_jsx(FilterCard, { filter: filter, activeFilter: activeFilter, handleActiveFilter: handleActiveFilter, handleFilter: handleFilter, selectedFilter: selectedFilter }, index)))] }));
}
