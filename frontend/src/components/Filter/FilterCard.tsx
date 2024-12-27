import { FaChevronDown } from "react-icons/fa6";
import Blackstar from "../../svgIcons/Blockstar";
import { capitalize } from "../../utils/capitalize";
type propsType = {
  filter: any;
  handleFilter: any;
  activeFilter: string[];
  handleActiveFilter: (type: string) => void;
  selectedFilter: any;
};
export default function FilterCard({
  filter,
  handleFilter,
  activeFilter,
  handleActiveFilter,
  selectedFilter,
}: propsType) {
  return (
    <div className="px-4 flex flex-col gap-y-2">
      <div
        onClick={() => handleActiveFilter(filter.type)}
        className="flex justify-between items-center cursor-pointer"
      >
        <h2 className="font-Poppins font-medium">{filter?.title}</h2>
        <span
          className={`h-fit transition-transform duration-300 cursor-pointer ${
            activeFilter.includes(filter?.type) ? "rotate-0" : "rotate-180"
          }`}
        >
          <FaChevronDown />
        </span>
      </div>
      <div
        className={`ml-4 flex flex-col gap-y-1 transition-all duration-300 overflow-hidden  max-h-fit  ${
          activeFilter.includes(filter?.type) ? "h-full" : "h-0"
        }`}
      >
        {filter?.value?.map((item: any, index: number) => {
          return (
            <div key={index} className="flex gap-x-2 items-center p-2">
              <input
                name={filter.type}
                type="checkbox"
                className=""
                value={filter.type !== "price" ? item : JSON.stringify(item)}
                onChange={handleFilter}
                checked={selectedFilter[filter.type].includes(
                  filter.type === "price"
                    ? JSON.stringify(item)
                    : filter.type == "place"
                    ? item.toLowerCase()
                    : item
                )}
              />
              <div className="flex gap-x-1 items-center">
                {filter?.type == "category" && capitalize(item)}
                {filter?.type == "rating" && item}
                {filter.type == "size" &&
                  item.charAt(0).toUpperCase() + item.slice(1)}
                {filter.type == "place" && item}
                {filter.type == "rating" && (
                  <div className="flex  items-center">
                    <Blackstar size="18" />
                    <span>& Above</span>
                  </div>
                )}
                {filter.type == "price" && (
                  <div>
                    {item.min == 0
                      ? `Under $${item.max}`
                      : item.max == Number.MAX_VALUE
                      ? `Above $${item.min}`
                      : `$${item.min}-$${item.max}`}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
