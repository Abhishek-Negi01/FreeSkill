import { useState, useMemo, useCallback } from "react";
import useDebounce from "../ui/useDebounce";

const useSearch = (debounceMs = 300) => {
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [searchFields, setSearchFields] = useState([]);

  const debouncedQuery = useDebounce(query, debounceMs);

  const filteredData = useMemo(() => {
    if (!debouncedQuery.trim() || !searchFields.length) return data;

    return data.filter((item) => {
      return searchFields.some((field) => {
        const value = field.split(".").reduce((obj, key) => obj?.[key], item);
        return value
          ?.toString()
          .toLowerCase()
          .includes(debouncedQuery.toLowerCase());
      });
    });
  }, [data, searchFields, debouncedQuery]);

  const setSearchData = useCallback((newData, fields = []) => {
    setData(newData);
    setSearchFields(fields);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery("");
  }, []);

  return {
    query,
    setQuery,
    filteredData,
    setSearchData,
    clearSearch,
    isSearching: query !== debouncedQuery,
  };
};

export default useSearch;
