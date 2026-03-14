import React, { useState } from "react";
import toast from "react-hot-toast";
import { youtubeServices } from "../api/services/youtube.js";
import {
  FaSearch,
  FaPlus,
  FaYoutube,
  FaClock,
  FaEye,
  FaEyeSlash,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

const YouTubeSearch = ({ onAddVideo }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [open, setOpen] = useState(false);

  const searchVideos = async (e) => {
    e.preventDefault();
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await youtubeServices.search(query);
      setResults(res.data.data.videos);
      setNextPageToken(res.data.data.nextPageToken);
    } catch {
      toast.error("Failed to search videos");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (!nextPageToken) return;
    setLoading(true);
    try {
      const res = await youtubeServices.search(query, nextPageToken);
      setResults([...results, ...res.data.data.videos]);
      setNextPageToken(res.data.data.nextPageToken);
    } catch {
      toast.error("Failed to load more videos");
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (duration) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const h = (match[1] || "").replace("H", "");
    const m = (match[2] || "").replace("M", "");
    const s = (match[3] || "").replace("S", "");
    if (h) return `${h}:${m.padStart(2, "0")}:${s.padStart(2, "0")}`;
    return `${m || "0"}:${s.padStart(2, "0")}`;
  };

  const formatViews = (views) => {
    const n = parseInt(views);
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return `${n}`;
  };

  const clearResults = () => {
    setResults([]);
    setHasSearched(false);
    setQuery("");
  };

  return (
    <div className="border border-red-200 rounded-xl overflow-hidden bg-red-50/50">
      {/* Toggle Header */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-red-50 transition-colors duration-200"
      >
        <div className="flex items-center gap-2.5">
          <div
            className="p-1.5 rounded-lg"
            style={{
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
            }}
          >
            <FaYoutube className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-gray-800">Search YouTube</p>
            <p className="text-xs text-gray-500">Find and add videos</p>
          </div>
        </div>
        {open ? (
          <FaChevronUp className="w-3.5 h-3.5 text-gray-400" />
        ) : (
          <FaChevronDown className="w-3.5 h-3.5 text-gray-400" />
        )}
      </button>

      {/* Expanded Content */}
      {open && (
        <div className="px-4 pb-4 animate-slideDown">
          <form onSubmit={searchVideos} className="flex gap-2 mb-3">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. React tutorial, Python basics..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-red-200 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent text-sm bg-white"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold text-xs text-white shadow transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 whitespace-nowrap"
              style={{
                background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              }}
            >
              {loading ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FaSearch className="w-3.5 h-3.5" />
              )}
              {loading ? "Searching..." : "Search"}
            </button>
          </form>

          {/* No results */}
          {hasSearched && results.length === 0 && !loading && (
            <p className="text-center text-sm text-gray-500 py-4">
              No videos found. Try different keywords.
            </p>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500">
                  {results.length} videos found
                </span>
                <button
                  onClick={clearResults}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaEyeSlash className="w-3 h-3" /> Hide
                </button>
              </div>
              {results.map((video) => (
                <div
                  key={video.videoId}
                  className="flex gap-3 p-2.5 bg-white rounded-lg border border-gray-100 hover:border-red-200 hover:shadow-sm transition-all duration-200"
                >
                  <div className="relative shrink-0 w-28 sm:w-32">
                    <img
                      src={
                        video.thumbnail ||
                        `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`
                      }
                      alt={video.title}
                      className="w-full h-16 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
                      }}
                      loading="lazy"
                    />
                    <span
                      className="absolute bottom-1 right-1 px-1 py-0.5 rounded text-xs font-semibold"
                      style={{ background: "rgba(0,0,0,0.8)", color: "white" }}
                    >
                      {formatDuration(video.duration)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 mb-0.5">
                        {video.title}
                      </h4>
                      <p className="text-xs text-gray-500 truncate">
                        {video.channelTitle}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <FaEye className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-400">
                          {formatViews(video.views)} views
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => onAddVideo(video)}
                      className="mt-1.5 self-start flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold text-xs text-white shadow transition-all duration-200 hover:-translate-y-0.5"
                      style={{
                        background:
                          "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      }}
                    >
                      <FaPlus className="w-3 h-3" /> Add
                    </button>
                  </div>
                </div>
              ))}
              {nextPageToken && (
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="w-full py-2 rounded-lg font-semibold text-xs text-white shadow transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50"
                  style={{
                    background:
                      "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
                  }}
                >
                  {loading ? "Loading..." : "Load More"}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default YouTubeSearch;
