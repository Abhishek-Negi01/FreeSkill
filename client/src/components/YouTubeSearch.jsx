import axios from "axios";
import React, { useState } from "react";

const YouTubeSearch = ({
  onAddVideo
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchVideos = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/youtube/search?query=${query}`,
        { withCredentials: true },
      );
      setResults(res.data.data.videos);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (duration) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = (match[1] || "").replace("H", "");
    const minutes = (match[2] || "").replace("M", "");
    const seconds = (match[3] || "").replace("S", "");

    if (hours)
      return `${hours}:${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`;
    return `${minutes || "0"}:${seconds.padStart(2, "0")}`;
  };

  const formatViews = (views) => {
    const num = parseInt(views);
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M views`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K views`;
    return `${num} views`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">Search YouTube Videos</h2>

      <form onSubmit={searchVideos} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for videos..."
            className="flex-l px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {/* search results */}
      {results.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold">Results: </h3>
          {results.map((video) => (
            <div
              key={video.videoId}
              className="border p-3 rounded flex items-center gap-3 hover:bg-gray-50"
            >
              <div className="relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-32 h-20 object-cover rounded"
                />
                <span className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                  {formatDuration(video.duration)}
                </span>
              </div>

              <div className="flex-1">
                <h4 className="font-semibold text-sm">{video.title}</h4>
                <p className="text-xs text-gray-500">{video.channelTitle}</p>
                <p className="text-xs text-gray-400">
                  {formatViews(video.views)}
                </p>
              </div>
              <button
                onClick={() => onAddVideo(video)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
              >
                + Add
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default YouTubeSearch;
