import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FaChevronDown } from "react-icons/fa6";
import Blackstar from "../../svgIcons/Blockstar";
import { capitalize } from "../../utils/capitalize";
export default function FilterCard({ filter, handleFilter, activeFilter, handleActiveFilter, selectedFilter, }) {
    return (_jsxs("div", { className: "px-4 flex flex-col gap-y-2", children: [_jsxs("div", { onClick: () => handleActiveFilter(filter.type), className: "flex justify-between items-center cursor-pointer", children: [_jsx("h2", { className: "font-Poppins font-medium", children: filter?.title }), _jsx("span", { className: `h-fit transition-transform duration-300 cursor-pointer ${activeFilter.includes(filter?.type) ? "rotate-0" : "rotate-180"}`, children: _jsx(FaChevronDown, {}) })] }), _jsx("div", { className: `ml-4 flex flex-col gap-y-1 transition-all duration-300 overflow-hidden  max-h-fit  ${activeFilter.includes(filter?.type) ? "h-full" : "h-0"}`, children: filter?.value?.map((item, index) => {
                    return (_jsxs("div", { className: "flex gap-x-2 items-center p-2", children: [_jsx("input", { name: filter.type, type: "checkbox", className: "", value: filter.type !== "price" ? item : JSON.stringify(item), onChange: handleFilter, checked: selectedFilter[filter.type].includes(filter.type === "price"
                                    ? JSON.stringify(item)
                                    : filter.type == "place"
                                        ? item.toLowerCase()
                                        : item) }), _jsxs("div", { className: "flex gap-x-1 items-center", children: [filter?.type == "category" && capitalize(item), filter?.type == "rating" && item, filter.type == "size" &&
                                        item.charAt(0).toUpperCase() + item.slice(1), filter.type == "place" && item, filter.type == "rating" && (_jsxs("div", { className: "flex  items-center", children: [_jsx(Blackstar, { size: "18" }), _jsx("span", { children: "& Above" })] })), filter.type == "price" && (_jsx("div", { children: item.min == 0
                                            ? `Under $${item.max}`
                                            : item.max == Number.MAX_VALUE
                                                ? `Above $${item.min}`
                                                : `$${item.min}-$${item.max}` }))] })] }, index));
                }) })] }));
}
