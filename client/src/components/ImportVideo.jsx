import React, { useState } from "react";
import { youtubeServices } from "../api/services/youtube";
import toast from "react-hot-toast";
import { FaYoutube, FaChevronDown, FaChevronUp, FaLink } from "react-icons/fa";
import { MdPlaylistAdd } from "react-icons/md";
import { BiImport } from "react-icons/bi";

const ImportVideo = ({ courseId, onVideoImported }) => {
  const [videoUrl, setVideoUrl] = useState("");
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("video"); // "video" | "playlist"

  const handleImportVideo = async (e) => {
    e.preventDefault();
    if (!videoUrl.trim()) return toast.error("Please enter a video URL");
    setLoading(true);
    try {
      const res = await youtubeServices.importVideo(courseId, videoUrl);
      toast.success(res.data.message || "Video imported!");
      setVideoUrl("");
      onVideoImported();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to import video");
    } finally {
      setLoading(false);
    }
  };

  const handleImportPlaylist = async (e) => {
    e.preventDefault();
    if (!playlistUrl.trim()) return toast.error("Please enter a playlist URL");
    setLoading(true);
    try {
      const res = await youtubeServices.importPlaylist(courseId, playlistUrl);
      const d = res.data.data;
      toast.success(
        `Imported ${d.imported} videos${d.skipped > 0 ? `, skipped ${d.skipped}` : ""}`,
      );
      setPlaylistUrl("");
      onVideoImported();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to import playlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-green-200 rounded-xl overflow-hidden bg-green-50/50">
      {/* Toggle Header */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-green-50 transition-colors duration-200"
      >
        <div className="flex items-center gap-2.5">
          <div
            className="p-1.5 rounded-lg"
            style={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            }}
          >
            <BiImport className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-gray-800">Import by URL</p>
            <p className="text-xs text-gray-500">
              Paste a video or playlist link
            </p>
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
          {/* Tabs */}
          <div className="flex gap-1 mb-3 p-1 bg-gray-100 rounded-lg">
            <button
              type="button"
              onClick={() => setTab("video")}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-semibold transition-all duration-200"
              style={
                tab === "video"
                  ? {
                      background:
                        "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                      color: "white",
                    }
                  : { color: "#6b7280" }
              }
            >
              <FaYoutube className="w-3.5 h-3.5" /> Video
            </button>
            <button
              type="button"
              onClick={() => setTab("playlist")}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-semibold transition-all duration-200"
              style={
                tab === "playlist"
                  ? {
                      background:
                        "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                      color: "white",
                    }
                  : { color: "#6b7280" }
              }
            >
              <MdPlaylistAdd className="w-3.5 h-3.5" /> Playlist
            </button>
          </div>

          {/* Video Form */}
          {tab === "video" && (
            <form onSubmit={handleImportVideo} className="flex gap-2">
              <div className="relative flex-1">
                <FaLink className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-red-200 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent text-sm bg-white"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold text-xs text-white shadow transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 whitespace-nowrap"
                style={{
                  background:
                    "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                }}
              >
                {loading ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FaYoutube className="w-3.5 h-3.5" />
                )}
                {loading ? "Importing..." : "Import"}
              </button>
            </form>
          )}

          {/* Playlist Form */}
          {tab === "playlist" && (
            <form onSubmit={handleImportPlaylist} className="flex gap-2">
              <div className="relative flex-1">
                <FaLink className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={playlistUrl}
                  onChange={(e) => setPlaylistUrl(e.target.value)}
                  placeholder="https://youtube.com/playlist?list=..."
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent text-sm bg-white"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold text-xs text-white shadow transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 whitespace-nowrap"
                style={{
                  background:
                    "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                }}
              >
                {loading ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <MdPlaylistAdd className="w-3.5 h-3.5" />
                )}
                {loading ? "Importing..." : "Import"}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default ImportVideo;
