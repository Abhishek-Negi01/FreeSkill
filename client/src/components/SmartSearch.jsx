import React, { useState } from "react";
import useYoutube from "../hooks/api/useYoutube";
import useToggle from "../hooks/ui/useToggle";
import {
  FaYoutube,
  FaPlus,
  FaSearch,
  FaEye,
  FaEyeSlash,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { MdPlaylistPlay } from "react-icons/md";

const SmartSearch = ({ onAddVideo, onImportPlaylist }) => {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [hasSearched, setHasSearched] = useState(false);

  // Use existing useYoutube hook instead of duplicating logic
  const {
    searchResults: results,
    loading,
    hasMore,
    smartSearch,
    loadMore,
    clearResults: clearYoutubeResults,
  } = useYoutube();

  const { value: open, toggle: toggleOpen } = useToggle(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setHasSearched(true);
    await smartSearch(query, type);
  };

  const handleLoadMore = async () => {
    await loadMore(query, "smart");
  };

  const clearResults = () => {
    clearYoutubeResults();
    setHasSearched(false);
    setQuery("");
  };

  // Move these to utils/formatters.js later
  const formatDuration = (duration) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return "";
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

  return (
    <div className="border border-purple-200 rounded-xl overflow-hidden bg-purple-50/50">
      {/* Toggle Header */}
      <button
        type="button"
        onClick={toggleOpen}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-purple-50 transition-colors duration-200"
      >
        <div className="flex items-center gap-2.5">
          <div
            className="p-1.5 rounded-lg"
            style={{
              background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
            }}
          >
            <FaSearch className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-gray-800">Smart Search</p>
            <p className="text-xs text-gray-500">Search videos & playlists</p>
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
          <form onSubmit={handleSearch} className="flex gap-2 mb-3">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search videos or playlists..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent text-sm bg-white"
                required
              />
            </div>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="px-2 py-2 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300 text-xs font-semibold bg-white text-gray-700 cursor-pointer"
            >
              <option value="all">All</option>
              <option value="video">Videos</option>
              <option value="playlist">Playlists</option>
            </select>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold text-xs text-white shadow transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 whitespace-nowrap"
              style={{
                background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
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
              No results found. Try different keywords.
            </p>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500">
                  {results.length} results
                </span>
                <button
                  onClick={clearResults}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaEyeSlash className="w-3 h-3" /> Hide
                </button>
              </div>
              {results.map((item, i) => (
                <div
                  key={`${item.type}-${item.videoId || item.playlistId}-${i}`}
                  className="flex gap-3 p-2.5 bg-white rounded-lg border border-gray-100 hover:border-purple-200 hover:shadow-sm transition-all duration-200"
                >
                  <div className="relative shrink-0 w-28 sm:w-32">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-16 object-cover rounded-lg"
                      loading="lazy"
                    />
                    {/* Type badge */}
                    <span
                      className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-xs font-bold"
                      style={{
                        background:
                          item.type === "video"
                            ? "rgba(239,68,68,0.9)"
                            : "rgba(139,92,246,0.9)",
                        color: "white",
                      }}
                    >
                      {item.type === "video" ? "VID" : "PL"}
                    </span>
                    {/* Duration / count */}
                    {item.type === "video" && item.duration && (
                      <span
                        className="absolute bottom-1 right-1 px-1 py-0.5 rounded text-xs font-semibold"
                        style={{
                          background: "rgba(0,0,0,0.8)",
                          color: "white",
                        }}
                      >
                        {formatDuration(item.duration)}
                      </span>
                    )}
                    {item.type === "playlist" && (
                      <span
                        className="absolute bottom-1 right-1 px-1 py-0.5 rounded text-xs font-semibold"
                        style={{
                          background: "rgba(0,0,0,0.8)",
                          color: "white",
                        }}
                      >
                        {item.videoCount} vids
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 mb-0.5">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500 truncate">
                        {item.channelTitle}
                      </p>
                      {item.type === "video" && item.views && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <FaEye className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-400">
                            {formatViews(item.views)} views
                          </span>
                        </div>
                      )}
                    </div>
                    {item.type === "video" ? (
                      <button
                        onClick={() => onAddVideo(item)}
                        className="mt-1.5 self-start flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold text-xs text-white shadow transition-all duration-200 hover:-translate-y-0.5"
                        style={{
                          background:
                            "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                        }}
                      >
                        <FaPlus className="w-3 h-3" /> Add
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          onImportPlaylist(
                            `https://www.youtube.com/playlist?list=${item.playlistId}`,
                          )
                        }
                        className="mt-1.5 self-start flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold text-xs text-white shadow transition-all duration-200 hover:-translate-y-0.5"
                        style={{
                          background:
                            "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                        }}
                      >
                        <MdPlaylistPlay className="w-3.5 h-3.5" /> Import
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {hasMore && (
                <button
                  onClick={handleLoadMore}
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

export default SmartSearch;
