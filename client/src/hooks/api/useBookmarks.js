import { useState, useEffect, useCallback } from "react";
import { bookmarkServices } from "../../api/services/bookmarks";
import toast from "react-hot-toast";

const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all bookmarks
  const fetchBookmarks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookmarkServices.getAll();
      setBookmarks(response.data.data.bookmarkedQuestions);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to load bookmarks";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Remove bookmark
  const removeBookmark = async (questionId) => {
    try {
      await bookmarkServices.toggle(questionId);
      setBookmarks((prev) => prev.filter((q) => q._id !== questionId));
      toast.success("Bookmark removed");
      return { success: true };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to remove bookmark";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Add bookmark (for use in other components)
  const addBookmark = async (questionId) => {
    try {
      await bookmarkServices.toggle(questionId);
      toast.success("Question bookmarked");
      // Refresh bookmarks to get updated list
      await fetchBookmarks();
      return { success: true };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to bookmark question";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Toggle bookmark (can be used for both add/remove)
  const toggleBookmark = async (questionId) => {
    const isBookmarked = bookmarks.some((q) => q._id === questionId);

    if (isBookmarked) {
      return await removeBookmark(questionId);
    } else {
      return await addBookmark(questionId);
    }
  };

  // Check if question is bookmarked
  const isBookmarked = useCallback(
    (questionId) => {
      return bookmarks.some((q) => q._id === questionId);
    },
    [bookmarks],
  );

  // Format date helper
  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString();
  }, []);

  // Load bookmarks on mount
  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  return {
    // Data
    bookmarks,
    loading,
    error,

    // Actions
    removeBookmark,
    addBookmark,
    toggleBookmark,

    // Utils
    fetchBookmarks,
    isBookmarked,
    formatDate,
    refetch: fetchBookmarks,

    // Computed
    bookmarkCount: bookmarks.length,
    hasBookmarks: bookmarks.length > 0,
    isEmpty: bookmarks.length === 0,
  };
};

export default useBookmarks;
