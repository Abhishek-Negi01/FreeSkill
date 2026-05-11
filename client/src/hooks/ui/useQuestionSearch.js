import { useState, useMemo } from "react";
import useDebounce from "./useDebounce";

const useQuestionSearch = (questions, debounceMs = 300) => {
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedQuery = useDebounce(searchQuery, debounceMs);

  const filteredQuestions = useMemo(() => {
    if (!debouncedQuery.trim()) return questions;

    const query = debouncedQuery.toLowerCase();
    return questions.filter(
      (q) =>
        q.title.toLowerCase().includes(query) ||
        q.body.toLowerCase().includes(query) ||
        q.askedByUsername?.toLowerCase().includes(query),
    );
  }, [questions, debouncedQuery]);

  const clearSearch = () => {
    setSearchQuery("");
  };

  return {
    searchQuery,
    setSearchQuery,
    filteredQuestions,
    clearSearch,
    isSearching: searchQuery !== debouncedQuery,
    hasResults: filteredQuestions.length > 0,
    resultCount: filteredQuestions.length,
  };
};

export default useQuestionSearch;
