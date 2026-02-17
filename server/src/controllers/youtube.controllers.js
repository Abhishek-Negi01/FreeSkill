import axios from "axios";
import { YOUTUBE_API_KEY } from "../utils/dotenv.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { YoutubeCache } from "../models/youtubeCache.models.js";

const searchYoutubeVideos = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query) {
    throw new ApiError(400, "search query is required");
  }

  const cachedResult = await YoutubeCache.findOne({ query });

  if (cachedResult) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { videos: cachedResult.videos },
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
      },
    },
  );

  //   console.log(searchResponse);

  const videoIds = searchResponse.data.items.map((item) => item.id.videoId);

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

  videos = videos.slice(0, 10); // top 10 videos

  await YoutubeCache.create({
    query,
    videos,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { videos }, "fresh video search successful"));
});

export { searchYoutubeVideos };
