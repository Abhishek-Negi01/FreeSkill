import axios from "axios";
import { YOUTUBE_API_KEY } from "../utils/dotenv.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { YoutubeCache } from "../models/youtubeCache.models.js";
import { Course } from "../models/course.models.js";
import { Video } from "../models/video.models.js";

const searchYoutubeVideos = asyncHandler(async (req, res) => {
  const { query, pageToken } = req.query;

  if (!query) {
    throw new ApiError(400, "search query is required");
  }

  const cacheKey = pageToken ? `${query}_${pageToken}` : query;
  const cachedResult = await YoutubeCache.findOne({ query: cacheKey });

  if (cachedResult) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          videos: cachedResult.videos,
          nextPageToken: cachedResult.nextPageToken,
        },
        "videos fetched from cache",
      ),
    );
  }

  // first call for search results
  const searchResponse = await axios.get(
    "https://www.googleapis.com/youtube/v3/search",
    {
      params: {
        part: "snippet",
        q: query,
        key: YOUTUBE_API_KEY,
        maxResults: 10,
        type: "video",
        pageToken: pageToken || undefined,
      },
    },
  );

  //   console.log(searchResponse);

  const videoIds = searchResponse.data.items.map((item) => item.id.videoId);
  const nextPageToken = searchResponse.data.nextPageToken;

  // second call for video details
  const videoResponse = await axios.get(
    "https://www.googleapis.com/youtube/v3/videos",
    {
      params: {
        part: "snippet,contentDetails,statistics",
        id: videoIds.join(","),
        key: YOUTUBE_API_KEY,
      },
    },
  );

  //   console.log(videoResponse);

  let videos = videoResponse.data.items.map((item) => ({
    videoId: item.id,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails.medium.url,
    channelTitle: item.snippet.channelTitle,
    duration: item.contentDetails.duration,
    views: item.statistics.viewCount,
  }));

  videos = videos.filter((video) => {
    const duration = video.duration;

    if (!duration.includes("M") && !duration.includes("H")) {
      return false; // Exclude videos shorter than 1 minute
    }

    const views = video.views;

    if (parseInt(views) < 5000) {
      return false; // Exclude videos with less than 5000 views
    }

    return true;
  });

  videos.sort((a, b) => parseInt(b.views) - parseInt(a.views)); // sort videos by views in descending order

  await YoutubeCache.create({
    query: cacheKey,
    videos,
    nextPageToken,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { videos, nextPageToken },
        "fresh video search successful",
      ),
    );
});

const smartSearch = asyncHandler(async (req, res) => {
  const { query, type = "all", pageToken } = req.query;

  if (!query) {
    throw new ApiError(400, "search query is required");
  }

  const cacheKey = `smart_${type}_${query}_${pageToken || ""}`;
  const cachedResult = await YoutubeCache.findOne({ query: cacheKey });

  if (cachedResult) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, cachedResult.videos, "results fetched from cache"),
      );
  }

  const searchType = type === "all" ? "video,playlist" : type;

  const searchResponse = await axios.get(
    "https://www.googleapis.com/youtube/v3/search",
    {
      params: {
        part: "snippet",
        q: query,
        key: YOUTUBE_API_KEY,
        maxResults: 15,
        type: searchType,
        pageToken: pageToken || undefined,
      },
    },
  );

  const videoIds = [];
  const playlistIds = [];
  const results = [];

  searchResponse.data.items.forEach((item) => {
    if (item.id.kind === "youtube#video") {
      videoIds.push(item.id.videoId);
    } else if (item.id.kind === "youtube#playlist") {
      playlistIds.push(item.id.playlistId);
    }
  });

  if (videoIds.length > 0) {
    const videoResponse = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          part: "snippet,contentDetails,statistics",
          id: videoIds.join(","),
          key: YOUTUBE_API_KEY,
        },
      },
    );

    videoResponse.data.items.forEach((item) => {
      const duration = item.contentDetails.duration;
      const views = parseInt(item.statistics.viewCount || 0);

      if ((duration.includes("M") || duration.includes("H")) && views >= 5000) {
        results.push({
          type: "video",
          videoId: item.id,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.medium.url,
          channelTitle: item.snippet.channelTitle,
          duration: duration,
          views: item.statistics.viewCount,
        });
      }
    });
  }

  if (playlistIds.length > 0) {
    const playlistResponse = await axios.get(
      "https://www.googleapis.com/youtube/v3/playlists",
      {
        params: {
          part: "snippet,contentDetails",
          id: playlistIds.join(","),
          key: YOUTUBE_API_KEY,
        },
      },
    );

    playlistResponse.data.items.forEach((item) => {
      results.push({
        type: "playlist",
        playlistId: item.id,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        videoCount: item.contentDetails.itemCount,
      });
    });
  }

  const nextPageToken = searchResponse.data.nextPageToken;

  await YoutubeCache.create({
    query: cacheKey,
    videos: { results, nextPageToken },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { results, nextPageToken },
        "smart search successful",
      ),
    );
});

const importVideoByUrl = asyncHandler(async (req, res) => {
  const { courseId, videoUrl } = req.body;
  const userId = req.auth?.userId;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  if (!courseId || !videoUrl) {
    throw new ApiError(400, "Course ID and video URL are required");
  }

  // verify course owner
  const course = await Course.findOne({ _id: courseId, creator: userId });
  if (!course) {
    throw new ApiError(404, "Course not found or unauthorized");
  }

  // Extract videoId from various YouTube URL formats
  const videoIdMatch = videoUrl.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
  );

  if (!videoIdMatch) {
    throw new ApiError(400, "Invalid YouTube URL");
  }

  const videoId = videoIdMatch[1];

  // check if video already exist

  const existingVideo = await Video.findOne({ videoId, course: courseId });

  if (existingVideo) {
    throw new ApiError(409, "Video already exists in this course");
  }

  // Fetch video details from YouTube API

  const videoResponse = await axios.get(
    "https://www.googleapis.com/youtube/v3/videos",
    {
      params: {
        part: "snippet,contentDetails,statistics",
        id: videoId,
        key: YOUTUBE_API_KEY,
      },
    },
  );

  if (!videoResponse?.data?.items || videoResponse.data.items.length === 0) {
    throw new ApiError(404, "Video not found on YouTube");
  }

  const videoData = videoResponse.data.items[0];

  // Get the highest order number for proper ordering
  const lastVideo = await Video.findOne({ course: courseId })
    .sort({ order: -1 })
    .limit(1);

  const nextOrder = lastVideo ? lastVideo.order + 1 : 1;

  const video = await Video.create({
    videoId: videoData.id,
    title: videoData.snippet.title,
    thumbnail: videoData.snippet.thumbnails.medium.url,
    channelTitle: videoData.snippet.channelTitle,
    duration: videoData.contentDetails.duration,
    course: courseId,
    order: nextOrder,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { video }, "Video imported successfully"));
});

const importPlaylist = asyncHandler(async (req, res) => {
  const { courseId, playlistUrl } = req.body;
  const userId = req.auth?.userId;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  if (!courseId || !playlistUrl) {
    throw new ApiError(400, "Course ID and playlist URL are required");
  }

  // verify course ownership
  const course = await Course.findOne({ _id: courseId, creator: userId });

  if (!course) {
    throw new ApiError(404, "Course not found or unauthorized");
  }

  // Extract playlistId from url
  const playlistIdMatch = playlistUrl.match(/[?&]list=([a-zA-Z0-9_-]+)/);

  if (!playlistIdMatch) {
    throw new ApiError(400, "Invalid YouTube playlist URL");
  }

  const playlistId = playlistIdMatch[1];

  // Get the highest order number for proper ordering
  const lastVideo = await Video.findOne({
    course: courseId,
  })
    .sort({ order: -1 })
    .limit(1);

  let currentOrder = lastVideo ? lastVideo.order + 1 : 1;

  let allVideos = [];
  let nextPageToken = null;

  // fetch all videos from playlist with pagination
  do {
    const playlistResponse = await axios.get(
      "https://www.googleapis.com/youtube/v3/playlistItems",
      {
        params: {
          part: "snippet",
          playlistId: playlistId,
          maxResults: 50,
          pageToken: nextPageToken,
          key: YOUTUBE_API_KEY,
        },
      },
    );

    if (
      !playlistResponse.data.items ||
      playlistResponse.data.items.length === 0
    ) {
      if (allVideos.length === 0) {
        throw new ApiError(404, "Playlist is empty or not found");
      }
      break;
    }

    allVideos = allVideos.concat(playlistResponse.data.items);
    nextPageToken = playlistResponse.data.nextPageToken;
  } while (nextPageToken);

  // Extract videos Id's
  const videoIds = allVideos
    .map((item) => item.snippet.resourceId.videoId)
    .filter((id) => id); // Remove any undefined only stores which is valid id

  if (videoIds.length === 0) {
    throw new ApiError(404, "No valid videos found in playlist");
  }

  // fetch detailed video information in batches (using youtube api we can only get max 50 per request)

  const batchSize = 50;
  let videoDetails = [];

  for (let i = 0; i < videoIds.length; i += batchSize) {
    const batchIds = videoIds.slice(i, i + batchSize);

    const videoResponse = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          part: "snippet,contentDetails,statistics",
          id: batchIds.join(","),
          key: YOUTUBE_API_KEY,
        },
      },
    );

    if (videoResponse.data.items) {
      videoDetails = videoDetails.concat(videoResponse.data.items);
    }
  }

  // filter videos (min 1 minute, 5000+ views) and prepare for insertion
  const videosToInsert = [];
  const skippedVideos = [];

  for (const videoData of videoDetails) {
    const duration = videoData.contentDetails.duration;
    const views = parseInt(videoData.statistics.viewCount || 0);

    // check if video already exist in course
    const existingVideo = await Video.findOne({
      videoId: videoData.id,
      course: courseId,
    });

    if (existingVideo) {
      skippedVideos.push({
        title: videoData.snippet.title,
        reason: "Already exists",
      });
      continue;
    }

    // apply duration and views filters

    if (!duration.includes("M") && !duration.includes("H")) {
      skippedVideos.push({
        title: videoData.snippet.title,
        reason: "Too short (< 1 minute)",
      });
      continue;
    }

    if (views < 5000) {
      skippedVideos.push({
        title: videoData.snippet.title,
        reason: "Low views (< 5000)",
      });
      continue;
    }

    videosToInsert.push({
      videoId: videoData.id,
      title: videoData.snippet.title,
      thumbnail: videoData.snippet.thumbnails.medium.url,
      channelTitle: videoData.snippet.channelTitle,
      duration: duration,
      course: courseId,
      order: currentOrder++,
    });
  }

  if (videosToInsert.length === 0) {
    throw new ApiError(
      400,
      "No videos met the criteria (min 1 minute, 5000+ views)",
    );
  }

  // Bulk insert video
  const insertedVideos = await Video.insertMany(videosToInsert);

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        imported: insertedVideos.length,
        skipped: skippedVideos.length,
        videos: insertedVideos,
        skippedVideos: skippedVideos,
      },
      `Successfully imported ${insertedVideos.length} videos from playlist`,
    ),
  );
});

export { searchYoutubeVideos, smartSearch, importVideoByUrl, importPlaylist };
