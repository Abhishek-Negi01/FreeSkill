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

  const fetchVideos = async () => {
    await videoServices
      .getAll(id)
      .then((res) => {
        setVideos(res.data.data.videos);
      })
      .catch((err) => console.log(err));
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
    await videoServices
      .addVideo(id, {
        videoId: video.videoId,
        title: video.title,
        thumbnail: video.thumbnail,
        channelTitle: video.channelTitle,
        duration: video.duration,
      })
      .then((res) => {
        setVideos([...videos, res.data.data.video]);
      })
      .catch((err) => console.log(err));
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!course) {
    return <div className="p-6">Course not found</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* course header */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
        <p className="text-gray-600 mb-4">{course.description}</p>

        {/* progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: "0%" }}
          ></div>
          <p className="text-sm text-gray-500 mt-2">0% Completed</p>
        </div>

        {/* youtube search */}
        <YouTubeSearch onAddVideo={handleAddVideo} />

        {/* videos list */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Playlist ({videos.length})</h2>
          {videos.length === 0 ? (
            <p className="text-gray-500">
              No videos yet. Add your first video!
            </p>
          ) : (
            <div className="space-y-4">
              {videos.map((video) => (
                <div
                  key={video._id}
                  className="border p-4 rounded flex items-center gap-4"
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-32 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold">{video.title}</h3>
                    <p className="text-sm text-gray-500">
                      {video.channelTitle}
                    </p>
                  </div>
                  <input type="checkbox" className="w-5 h-5" />
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
