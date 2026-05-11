import { useState, useEffect, useCallback } from "react";
import { courseService } from "../../api/services/courses";
import toast from "react-hot-toast";

const usePublicCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);

  // Fetch public courses
  const fetchPublicCourses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await courseService.getPublicCourses(page, 10, search);
      const data = response.data.data;
      setCourses(data.courses);
      setTotalPages(data.totalPages);
      setTotalCourses(data.totalCourses);
    } catch (error) {
      toast.error("Failed to load public courses");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  // Clone a public course
  const cloneCourse = async (courseId) => {
    try {
      await courseService.clonePublicCourse(courseId);
      toast.success("Course cloned successfully! Check your dashboard.");
      return { success: true };
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to clone course";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Handle search
  const handleSearch = useCallback((searchQuery) => {
    setSearch(searchQuery);
    setPage(1); // Reset to first page when searching
  }, []);

  // Handle pagination
  const goToPage = useCallback(
    (newPage) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setPage(newPage);
      }
    },
    [totalPages],
  );

  const nextPage = useCallback(() => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  }, [page, totalPages]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  }, [page]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearch("");
    setPage(1);
  }, []);

  // Load courses when page or search changes
  useEffect(() => {
    fetchPublicCourses();
  }, [fetchPublicCourses]);

  return {
    // Data
    courses,
    loading,
    search,
    page,
    totalPages,
    totalCourses,

    // Actions
    cloneCourse,
    handleSearch,
    goToPage,
    nextPage,
    prevPage,
    clearSearch,

    // Utils
    fetchPublicCourses,
    refetch: fetchPublicCourses,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    isFirstPage: page === 1,
    isLastPage: page === totalPages,
  };
};

export default usePublicCourses;
