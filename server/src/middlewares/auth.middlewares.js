import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../utils/dotenv.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";

export const authenticateUser = asyncHandler(async (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res.status(401).json(new ApiResponse(401, {}, "Unauthorized."));
  }

  try {
    const decodedToken = await jwt.verify(accessToken, ACCESS_TOKEN_SECRET);

    if (!decodedToken || !decodedToken.userId) {
      throw new ApiError(401, "Invalid access token.");
    }

    const userId = decodedToken.userId;

    const user = await User.findById(userId).select("-password -refreshToken");

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token.");
  }
});
