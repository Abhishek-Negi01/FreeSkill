import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 5000;
export const MONGODB_URI = process.env.MONGODB_URI;
export const DB_NAME = process.env.DB_NAME;
export const CORS_ORIGIN = process.env.CORS_ORIGIN;
export const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
export const FRONTEND_URL = process.env.FRONTEND_URL;
export const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
export const CLERK_PUBLISHABLE_KEY = process.env.CLERK_PUBLISHABLE_KEY;
