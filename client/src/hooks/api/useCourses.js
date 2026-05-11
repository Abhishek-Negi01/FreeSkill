import { useState, useEffect } from "react";
import { courseService } from "../../api/services/courses";
import toast from "react-hot-toast";

const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCourses, setFetchingCourses] = useState(true);
  const [error, setError] = useState(null);
  const [courseStats, setCourseStats] = useState({});

  // Fetch course statistics
  const fetchCourseStatistics = async (courseList) => {
    if (!courseList || courseList.length === 0) return;

    const stats = {};
    try {
      await Promise.all(
        courseList.map(async (course) => {
          try {
            const res = await courseService.getStatistics(course._id);
            stats[course._id] = res.data.data.statistics;
          } catch (err) {
            console.error(`Failed to fetch stats for ${course._id}`);
          }
        }),
      );
      setCourseStats(stats);
    } catch (error) {
      console.error("Error fetching course statistics:", error);
    }
  };

  // Fetch all courses
  const fetchCourses = async () => {
    setFetchingCourses(true);
    try {
      const res = await courseService.getAll();
      const fetchedCourses = res.data.data.courses;
      setCourses(fetchedCourses);
      setError(null);

      // Fetch statistics after courses are loaded
      await fetchCourseStatistics(fetchedCourses);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load courses");
      await fetchCourses();
    } finally {
      setFetchingCourses(false);
    }
  };

  // Create course
  const createCourse = async (courseData) => {
    setLoading(true);
    try {
      const res = await courseService.create(courseData);
      setCourses((prev) => [...prev, res.data.data.course]);
      toast.success(res?.data?.message || "Course created successfully!");
      return { success: true, course: res.data.data.course };
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || "Failed to create course";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Update course
  const updateCourse = async (courseId, courseData) => {
    setLoading(true);
    try {
      const res = await courseService.update(courseId, courseData);
      setCourses((prev) =>
        prev.map((c) => (c._id === courseId ? res.data.data.course : c)),
      );
      toast.success(res?.data?.message || "Course updated successfully!");
      return { success: true, course: res.data.data.course };
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to update course";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Delete course
  const deleteCourse = async (courseId) => {
    try {
      const res = await courseService.delete(courseId);
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
      toast.success(res?.data?.message || "Course deleted successfully!");
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to delete course";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Toggle course visibility
  const togglePublic = async (courseId, currentStatus) => {
    try {
      const res = await courseService.togglePublic(courseId);
      setCourses((prev) =>
        prev.map((c) =>
          c._id === courseId ? { ...c, isPublic: !currentStatus } : c,
        ),
      );
      toast.success(res?.data?.message || "Course visibility updated!");
      return { success: true };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to update visibility";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Load courses on mount
  useEffect(() => {
    fetchCourses();
  }, []);

  return {
    // Data
    courses,
    loading,
    fetchingCourses,
    error,
    courseStats,

    // Actions
    createCourse,
    updateCourse,
    deleteCourse,
    togglePublic,

    // Utils
    fetchCourses,
    refetch: fetchCourses,
  };
};

export default useCourses;
