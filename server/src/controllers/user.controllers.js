import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcryptjs from "bcryptjs";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { REFRESH_TOKEN_SECRET } from "../utils/dotenv.js";
import crypto from "crypto";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "../utils/email.js";

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
      secure: true,
      sameSite: "None",
      path: "/",
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
      401,
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

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new ApiError(
      409,
      "User with the same email or username already exists.",
    );
  }

  const user = await User.create({ username, fullname, email, password });
  if (!user) {
    throw new ApiError(500, "Failed to create user.");
  }

  // send verification email automatically
  const token = crypto.randomBytes(32).toString("hex");
  await User.findByIdAndUpdate(user._id, {
    emailVerificationToken: token,
    emailVerificationExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
  await sendVerificationEmail(user.email, token);

  return res.status(201).json({
    success: true,
    message:
      "Registration successful. Please check your email to verify your account.",
  });
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

  if (!user.isEmailVerified) {
    throw new ApiError(401, "Please verify your email before logging in.");
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
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
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
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
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
      secure: true,
      sameSite: "None",
      path: "/",
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

const sendEmailVerification = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.isEmailVerified) {
    throw new ApiError(400, "Email already verified");
  }

  const token = crypto.randomBytes(32).toString("hex");
  user.emailVerificationToken = token;
  user.emailVerificationExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  await user.save();

  await sendVerificationEmail(user.email, token);
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Verification email sent"));
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;

  if (!token) {
    throw new ApiError(400, "Token is required");
  }

  const user = await User.findOne({ emailVerificationToken: token });

  if (!user) {
    // token already cleared — check if a verified user had this token recently
    // not possible without storing it, so handle in frontend
    throw new ApiError(400, "Invalid or expired token");
  }

  if (user.emailVerificationExpiry < Date.now()) {
    throw new ApiError(400, "Verification link has expired");
  }

  // already verified (second StrictMode call) — return success
  if (user.isEmailVerified) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Email verified successfully"));
  }

  // first call — verify and keep token for a short window (don't unset yet)
  await User.findByIdAndUpdate(user._id, {
    isEmailVerified: true,
    emailVerificationExpiry: new Date(Date.now() + 60 * 1000), // keep token alive 60 more seconds
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Email verified successfully"));
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const token = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpiry = Date.now() + 60 * 60 * 1000; // 1 hour

  await user.save();

  await sendPasswordResetEmail(user.email, token);
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset email sent"));
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired token");
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiry = undefined;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successfully"));
});

const changePassword = asyncHandler(async (req, res) => {
  const userId = req?.user?._id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "All fields are required");
  }

  if (newPassword.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await bcryptjs.compare(
    currentPassword,
    user.password,
  );
  if (!isPasswordValid) {
    throw new ApiError(401, "Current password is incorrect");
  }

  user.password = newPassword;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
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
  sendEmailVerification,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword,
};
