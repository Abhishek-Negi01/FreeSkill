import { useState } from "react";
import { youtubeServices } from "../../api/services/youtube";
import toast from "react-hot-toast";

const useYoutube = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  // Search YouTube videos
  const searchVideos = async (query, pageToken = null) => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await youtubeServices.search(query, pageToken);
      const data = res.data.data;

      if (pageToken) {
        // Append to existing results (load more)
        setSearchResults((prev) => [...prev, ...data.videos]);
      } else {
        // New search
        setSearchResults(data.videos);
      }

      setNextPageToken(data.nextPageToken);
      setHasMore(!!data.nextPageToken);
      setError(null);

      return { success: true, data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Search failed";
      setError(errorMsg);
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Smart search (videos + playlists)
  const smartSearch = async (query, type = "all", pageToken = null) => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await youtubeServices.smartSearch(query, type, pageToken);
      const data = res.data.data;

      if (pageToken) {
        setSearchResults((prev) => [...prev, ...data.results]);
      } else {
        setSearchResults(data.results);
      }

      setNextPageToken(data.nextPageToken);
      setHasMore(!!data.nextPageToken);
      setError(null);

      return { success: true, data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Search failed";
      setError(errorMsg);
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Load more results
  const loadMore = async (query, searchType = "videos") => {
    if (!hasMore || loading) return;

    if (searchType === "smart") {
      return await smartSearch(query, "all", nextPageToken);
    } else {
      return await searchVideos(query, nextPageToken);
    }
  };

  // Clear search results
  const clearResults = () => {
    setSearchResults([]);
    setNextPageToken(null);
    setHasMore(false);
    setError(null);
  };

  return {
    // Data
    searchResults,
    loading,
    error,
    hasMore,
    nextPageToken,

    // Actions
    searchVideos,
    smartSearch,
    loadMore,
    clearResults,
  };
};

export default useYoutube;
