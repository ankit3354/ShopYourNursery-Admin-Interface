import { useEffect, useState } from "react";
import Filter from "../Filter/Filter";
import filterMap from "../../constants/filterMap";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import * as apiClient from "../../apiClient/apiClient";
import { clearFilters, setFilters } from "../../feature/Filter/filterSlice";
import { getSearchQueryPlants } from "../../apiClient/apiClient";
import Pagination from "./Pagination";
import Spinner from "../Loading/Spinner";
import Products from "./Products";

const ShowAllPlantsAdmin = () => {
  const { selectedFilter } = useSelector((state: any) => state.filter);
  const dispatch = useDispatch();

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query"));
  useEffect(() => {
    setSearchQuery(searchParams.get("query"));
  }, [searchParams.get("query")]);

  const { data, isLoading, error }: any = useQuery({
    queryKey: ["fetchPlants", selectedFilter, searchQuery],
    queryFn: () => {
      if (searchQuery) {
        console.log("query");
        handleClear();
        return getSearchQueryPlants(searchQuery);
      } else {
        return apiClient.fetchPlants(selectedFilter);
      }
    },
  });

  const handleClear = () => {
    dispatch(clearFilters());
  };

  const handlePage = (pageNumber: any) => {
    dispatch(setFilters({ ...selectedFilter, page: pageNumber }));
    // setSelectedFilter((prev: any) => ({ ...prev, page: pageNumber }));
    window.scrollTo(0, 0);
  };

  const handleFilter = (e: any) => {
    const type: string = e.target.name;
    const value: string | number =
      type == "rating"
        ? parseInt(e.target.value)
        : e.target.value.toLowerCase();

    const filterFn = (prev: any) => {
      const filteredList = prev[type]?.includes(value)
        ? prev[type].filter((item: any) => item !== value)
        : [...prev[type], value];
      return { ...prev, [type]: filteredList, page: "1" };
    };
    const prev = selectedFilter;
    const result = filterFn(prev);
    dispatch(setFilters(result));
    sessionStorage.setItem("selectedFilter", JSON.stringify(result));
    setSearchParams(result);
    setSearchQuery("");
  };

  return (
    <div className="flex mt-28 gap-8 mx-auto items-start">
      <div className="ml-10">
        <Filter
          filterMap={filterMap}
          handleFilter={handleFilter}
          selectedFilter={selectedFilter}
          handleClear={handleClear}
        />
      </div>
      <div className="flex flex-col gap-4 w-full">
        {isLoading ? (
          <div className="font-medium flex justify-center items-center gap-x-4 h-96 w-full">
            <Spinner />
            <span>Fetching ...</span>
          </div>
        ) : !data ? (
          <div className="font-medium  flex justify-center items-center gap-x-4 h-96 w-full">
            {error?.message}
          </div>
        ) : (
          data.plants && (
            <div>
              {data?.plants.length == 0 ? (
                <div className="font-medium h-[10rem] flex items-center justify-center space-x-2">
                  No Plants Found
                </div>
              ) : (
                <Products products={data?.plants} />
              )}

              {data?.pagination.pages !== 1 && (
                <Pagination
                  pages={data.pagination.pages}
                  activePage={
                    data.pagination.page == 1
                      ? data.pagination.page
                      : selectedFilter.page
                  }
                  handlePage={handlePage}
                />
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ShowAllPlantsAdmin;
