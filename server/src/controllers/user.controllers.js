import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcryptjs from "bcryptjs";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { REFRESH_TOKEN_SECRET } from "../utils/dotenv.js";

const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies?.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(401, "Unauthorized.");
    }

    const decodedToken = jwt.verify(incomingRefreshToken, REFRESH_TOKEN_SECRET);

    if (!decodedToken || !decodedToken.userId) {
      throw new ApiError(401, "Unauthorized.");
    }

    const userId = decodedToken.userId;

    const user = await User.findById(userId);
    if (!user || user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "Invalid refresh token.");
    }

    const { accessToken, refreshToken } =
      await generateRefreshAndAccessTokens(user);

    const cookieOptions = {
      httpOnly: true,
    };
    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access token refreshed successfully.",
        ),
      );
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while refreshing access token.",
    );
  }
});

const generateRefreshAndAccessTokens = async (user) => {
  const userId = user._id;
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("token generation failed", error.message);
    throw new ApiError(500, "Something went wrong while generating tokens.");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, fullname, email, password } = req.body;
  if (
    [username, fullname, email, password].some((field) => field?.trim() == "")
  ) {
    throw new ApiError(400, "All fields are required.");
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new ApiError(
      409,
      "User with the same email or username already exists.",
    );
  }

  try {
    const user = await User.create({
      username,
      fullname,
      email,
      password,
    });

    if (!user) {
      throw new ApiError(500, "Failed to create user.");
    }

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
    });
  } catch (error) {
    console.log("user registration failed", error);
    throw new ApiError(500, "Something went wrong while registering the user.");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => field?.trim() == "")) {
    throw new ApiError(400, "Email and password are required.");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const isPasswordValid = await bcryptjs.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials.");
  }

  const { accessToken, refreshToken } =
    await generateRefreshAndAccessTokens(user);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!loggedInUser) {
    throw new ApiError(404, "User not found after login.");
  }

  const cookieOptions = {
    httpOnly: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(200, { user: loggedInUser }, "Login successful."));
});

const logoutUser = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized.");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true },
  );

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const cookieOptions = {
    httpOnly: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "Logout successful."));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized.");
  }

  const user = await User.findById(userId).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "User fetched successfully."));
});

const getAllUsers = asyncHandler(async (req, res, next) => {
  try {
    const users = await User.find().select("-password -refreshToken");

    return res
      .status(200)
      .json(new ApiResponse(200, { users }, "Users fetched successfully."));
  } catch (error) {
    throw new ApiError(500, "Failed to fetch users.");
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(401, "Unauthorized.");
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    const cookieOptions = {
      httpOnly: true,
    };

    return res
      .status(200)
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .json(new ApiResponse(200, {}, "User deleted successfully."));
  } catch (error) {
    throw new ApiError(500, "Failed to delete user.");
  }
});

const updateUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }

    const { username, fullname, email } = req.body;
    if ([username, fullname, email].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "All fields are required");
    }

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      throw new ApiError(404, "user not found");
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          username,
          fullname,
          email,
        },
      },
      { new: true },
    ).select("-password -refreshToken");

    if (!updatedUser) {
      throw new ApiError(500, "Failed to update user");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user: updatedUser },
          "user updated successfully",
        ),
      );
  } catch (error) {
    throw new ApiError(500, "failed to update user");
  }
});

export {
  refreshAccessToken,
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  getAllUsers,
  deleteUser,
  updateUser,
};
