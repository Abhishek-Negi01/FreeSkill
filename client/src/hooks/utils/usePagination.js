import { useState, useMemo, useCallback } from "react";

const usePagination = (itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginationData = useMemo(
    () => ({
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1,
      startIndex: (currentPage - 1) * itemsPerPage,
      endIndex: Math.min(currentPage * itemsPerPage, totalItems),
    }),
    [currentPage, totalPages, totalItems, itemsPerPage],
  );

  const goToPage = useCallback(
    (page) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages],
  );

  const nextPage = useCallback(() => {
    if (paginationData.hasNext) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [paginationData.hasNext]);

  const prevPage = useCallback(() => {
    if (paginationData.hasPrev) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [paginationData.hasPrev]);

  const reset = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    ...paginationData,
    setTotalItems,
    goToPage,
    nextPage,
    prevPage,
    reset,
  };
};

export default usePagination;
