import React, { useState } from "react";
import { youtubeServices } from "../api/services/youtube";
import toast from "react-hot-toast";
import { FaYoutube } from "react-icons/fa";
import { MdPlaylistAdd } from "react-icons/md";
import { BiImport } from "react-icons/bi";

const ImportVideo = ({ courseId, onVideoImported }) => {
  const [videoUrl, setVideoUrl] = useState("");
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showImport, setShowImport] = useState(false);

  const handleImportVideo = async (e) => {
    e.preventDefault();
    if (!videoUrl.trim()) {
      toast.error("Please enter a video URL");
      return;
    }

    try {
      setLoading(true);
      const response = await youtubeServices.importVideo(courseId, videoUrl);
      toast.success(response.data.message || "Video imported successfully!");
      setVideoUrl("");
      onVideoImported();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to import video");
    } finally {
      setLoading(false);
    }
  };

  const handleImportPlaylist = async (e) => {
    e.preventDefault();
    if (!playlistUrl.trim()) {
      toast.error("Please enter a playlist URL");
      return;
    }

    try {
      setLoading(true);
      const response = await youtubeServices.importPlaylist(
        courseId,
        playlistUrl,
      );
      const data = response.data.data;
      toast.success(
        `Imported ${data.imported} videos${data.skipped > 0 ? `, skipped ${data.skipped}` : ""}`,
      );
      setPlaylistUrl("");
      onVideoImported();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to import playlist");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="mb-6">
      <button
        onClick={() => setShowImport(!showImport)}
        className="btn btn-accent flex items-center gap-2"
      >
        <BiImport className="w-4 h-4 md:w-5 md:h-5" />
        {showImport ? "Hide Import" : "Import Video/Playlist"}
      </button>

      {showImport && (
        <div className="card p-4 md:p-6 mt-4 space-y-6 animate-slideDown">
          {/* Import Single Video */}
          <div>
            <h3
              className="font-semibold mb-3 flex items-center gap-2 text-sm md:text-base"
              style={{ color: "#1f2937" }}
            >
              <FaYoutube
                className="w-5 h-5 md:w-6 md:h-6"
                style={{ color: "#ef4444" }}
              />
              Import Single Video
            </h3>
            <form
              onSubmit={handleImportVideo}
              className="flex flex-col sm:flex-row gap-2"
            >
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Paste YouTube video URL"
                className="input flex-1"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary whitespace-nowrap"
              >
                <FaYoutube className="w-4 h-4" />
                {loading ? "Importing..." : "Import Video"}
              </button>
            </form>
            <p className="text-xs md:text-sm mt-2" style={{ color: "#9ca3af" }}>
              Example: https://www.youtube.com/watch?v=VIDEO_ID
            </p>
          </div>

          {/* Import Playlist */}
          <div>
            <h3
              className="font-semibold mb-3 flex items-center gap-2 text-sm md:text-base"
              style={{ color: "#1f2937" }}
            >
              <MdPlaylistAdd
                className="w-5 h-5 md:w-6 md:h-6"
                style={{ color: "#8b5cf6" }}
              />
              Import Playlist
            </h3>
            <form
              onSubmit={handleImportPlaylist}
              className="flex flex-col sm:flex-row gap-2"
            >
              <input
                type="text"
                value={playlistUrl}
                onChange={(e) => setPlaylistUrl(e.target.value)}
                placeholder="Paste YouTube playlist URL"
                className="input flex-1"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="btn btn-secondary whitespace-nowrap"
              >
                <MdPlaylistAdd className="w-4 h-4" />
                {loading ? "Importing..." : "Import Playlist"}
              </button>
            </form>
            <p className="text-xs md:text-sm mt-2" style={{ color: "#9ca3af" }}>
              Example: https://www.youtube.com/playlist?list=PLAYLIST_ID
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportVideo;
