import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { courseService } from "../../api/services/courses";
import { videoServices } from "../../api/services/videos";
import YouTubeSearch from "../../components/YouTubeSearch";

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState(null);

  const progress =
    videos.length === 0
      ? 0
      : Math.round(
          (videos.filter((v) => v.isCompleted).length / videos.length) * 100,
        );

  const fetchVideos = async () => {
    try {
      const res = await videoServices.getAll(id);
      setVideos(res.data.data.videos);
      if (res.data.data.videos.length > 0 && !currentVideo) {
        setCurrentVideo(res.data.data.videos[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // fetch course
    courseService
      .getById(id)
      .then((res) => {
        setCourse(res.data.data.course);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
    fetchVideos();
  }, [id]);

  const handleAddVideo = async (video) => {
    try {
      const res = await videoServices.addVideo(id, {
        videoId: video.videoId,
        title: video.title,
        thumbnail: video.thumbnail,
        channelTitle: video.channelTitle,
        duration: video.duration,
      });

      const newVideo = res.data.data.video;
      setVideos([...videos, newVideo]);
      if (!currentVideo) {
        setCurrentVideo(newVideo);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleVideoComplete = async (videoId, currentStatus) => {
    try {
      // TODO : toggle incomplete api to uncomplete
      if (currentStatus) {
        return;
      }

      await videoServices.markCompleted(videoId);
      setVideos(
        videos.map((v) =>
          v._id === videoId ? { ...v, isCompleted: true } : v,
        ),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    try {
      if (!confirm("Delete this video?")) {
        return;
      }

      await videoServices.deleteVideo(videoId);
      setVideos(videos.filter((v) => v._id !== videoId));

      if (currentVideo?._id === videoId) {
        setCurrentVideo(videos[0] || null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatDuration = (duration) => {
    if (!duration) {
      return "";
    }

    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) {
      return "";
    }
    const hours = (match[1] || "").replace("H", "");
    const minutes = (match[2] || "").replace("M", "");
    const seconds = (match[3] || "").replace("S", "");

    if (hours) {
      return `${hours}:${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`;
    }
    return `${minutes || "0"}:${seconds.padStart(2, "0")}`;
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!course) {
    return <div className="p-6">Course not found</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* course header */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
        <p className="text-gray-600 mb-4">{course.description}</p>

        {/* progress bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2 ">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-1">{progress}% Completed</p>
        </div>

        {/* youtube search */}
        <YouTubeSearch onAddVideo={handleAddVideo} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* video player */}
        <div className="lg:col-span-2">
          {currentVideo ? (
            <div className="bg-white p-4 rounded-lg shadow-md  ">
              <div className="aspect-video mb-4">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${currentVideo.videoId}`}
                  title={currentVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope;  picture-in-picture"
                  allowFullScreen
                  className="rounded"
                ></iframe>
              </div>
              <h2 className="text-xl font-bold mb-2">{currentVideo.title}</h2>
              <p className="text-gray-600">{currentVideo.channelTitle}</p>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-md text-center text-gray-500 ">
              No videos available
            </div>
          )}
        </div>

        {/* playlist */}
        <div className="bg-white p-4 rounded-lg shadow-md h-fit">
          <h2 className="text-xl font-bold mb-4">Playlist ({videos.length})</h2>

          {videos.length === 0 ? (
            <p className="text-gray-500 text-sm">No videos yet..</p>
          ) : (
            <div className="space-y-2">
              {videos.map((video) => (
                <div
                  key={video._id}
                  className={`border p-3 rounded cursor-pointer hover:bg-gray-50 ${currentVideo?._id === video._id ? "bg-blue-50 border-blue-500" : ""}`}
                  onClick={() => setCurrentVideo(video)}
                >
                  <div className="flex gap-2">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-24 h-16 object-cover rounded"
                    />

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate">
                        {video.title}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">
                        {video.channelTitle}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDuration(video.duration)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={video.isCompleted}
                        onChange={() => {
                          handleVideoComplete(video._id, video.isCompleted);
                        }}
                        className="w-4 h-4"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="text-xs text-gray-600">Completed</span>
                    </label>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteVideo(video._id);
                      }}
                      className="text-red-600 hover:text-red-800 text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
