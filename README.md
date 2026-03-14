# FreeSkill

A full-stack learning management platform that lets users build personalized courses from YouTube content, track their progress, and engage in community-driven Q&A.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Core Features](#core-features)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)

---

## Overview

FreeSkill solves the problem of unstructured self-paced learning. Users can organize YouTube videos into structured courses, monitor completion, and participate in a Stack Overflow-style Q&A system — all in one place.

**Target Users:** Self-learners, students, and professionals who want to organize and track their learning across technical topics.

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express.js | REST API server |
| MongoDB + Mongoose | Database and ODM |
| JWT (jsonwebtoken) | Access and refresh token auth |
| bcryptjs | Password hashing |
| Nodemailer | Email verification and password reset |
| YouTube Data API v3 | Video search and metadata |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | UI framework and build tool |
| React Router v6 | Client-side routing |
| Tailwind CSS v4 | Styling |
| Axios | HTTP client with interceptors |
| Context API | Global auth and state management |
| react-hot-toast | Notifications |

---

## Core Features

### Authentication & Security
- JWT-based auth with short-lived access tokens (15m) and long-lived refresh tokens (3d)
- **Email verification required before login** — unverified users cannot access the platform
- Verification email sent automatically on registration with a 24-hour expiry token
- Idempotent email verification — handles React StrictMode double-invocation gracefully
- Password reset via email with 1-hour expiry token
- Change password for authenticated users
- Secure HTTP-only cookies for token storage
- Protected routes on both frontend and backend

### Course Management
- Create, read, update, and delete courses
- Toggle course visibility between **public** (browsable by anyone) and **private** (only visible to you)
- Public courses appear in the public course browser with view and clone counts
- Private courses are completely hidden from all other users and the public listing
- Duplicate your own courses with all videos
- Clone public courses from other users into your own private library
- Course statistics — total videos, total duration, completion rate
- Course progress tracking per user

### Video Management
- Add YouTube videos to courses via search or direct URL import
- Import entire YouTube playlists in bulk — fetches all pages, batch-processes up to 50 videos per API call
- Smart search — search videos and playlists simultaneously with type filter (video / playlist / all)
- Reorder videos within a course via drag-and-drop
- Mark videos as completed
- Remove videos from courses
- YouTube search results cached (MongoDB TTL) to reduce API quota usage — keyed by query + pageToken
- Video filtering — minimum 1 minute duration, 5000+ views, sorted by popularity
- Load more — "Load More" button appends next page of results using `nextPageToken` (both YouTubeSearch and SmartSearch)

### Public Course Browsing
- Browse all public courses without authentication
- View public course details and video list without authentication
- Authenticated users can clone public courses into their own library
- View count and clone count tracking per public course
- Search public courses by title or description
- Paginated results — page/totalPages/totalCourses returned from API, Previous/Next controls on frontend

### Q&A System
- Post questions linked to specific videos or courses
- Answer questions from the community
- Upvote and downvote questions and answers
- Accept an answer as the correct solution (question author only)
- Edit and delete your own questions and answers
- View all questions in a community feed
- Filter questions by video
- Bookmark questions for later reference
- Notification system for Q&A interactions

### Progress Tracking
- Real-time progress calculation per course
- Visual progress bar on course detail page
- Completed video count and percentage display
- Progress persists across sessions

---

## Project Structure

```
FreeSkill/
├── server/
│   └── src/
│       ├── controllers/     # Business logic
│       ├── models/          # Mongoose schemas
│       ├── routes/          # Express route definitions
│       ├── middlewares/     # Auth middleware
│       └── utils/           # Helpers (email, error handling, async wrapper)
└── client/
    └── src/
        ├── api/
        │   ├── axios.js         # Axios instance with interceptors
        │   └── services/        # Per-domain API service functions
        ├── components/
        │   ├── layout/          # Navbar, ProtectedRoute, PublicRoute
        │   ├── YouTubeSearch    # Search and add videos
        │   ├── ImportVideo      # Import by URL or playlist link
        │   └── SmartSearch      # Search videos and playlists with filter
        ├── context/             # AuthContext
        ├── pages/
        │   ├── auth/            # Login, Register, ForgotPassword, ResetPassword, VerifyEmail
        │   ├── courses/         # Dashboard, CourseDetails, PublicCourses, PublicCourseDetail
        │   └── questionAnswer/  # QuestionList, QuestionDetail, AskQuestion, VideoQuestions
        └── App.jsx
```

---

## API Reference

### Authentication
```
POST   /api/users/register              Register and send verification email
POST   /api/users/login                 Login (requires verified email)
POST   /api/users/logout                Logout and clear cookies
POST   /api/users/refresh-token         Refresh access token
GET    /api/users/me                    Get current user
PUT    /api/users/updateUser            Update profile
DELETE /api/users/deleteUser            Delete account
PUT    /api/users/change-password       Change password
POST   /api/users/forgot-password       Send password reset email
POST   /api/users/reset-password        Reset password with token
GET    /api/users/verify-email          Verify email with token
POST   /api/users/send-verification     Resend verification email
```

### Courses
```
POST   /api/courses/                    Create course
GET    /api/courses/                    Get all user courses
GET    /api/courses/:courseId           Get course by ID
PUT    /api/courses/:courseId           Update course
DELETE /api/courses/:courseId           Delete course
GET    /api/courses/:courseId/progress  Get course progress
POST   /api/courses/:courseId/duplicate Duplicate course
GET    /api/courses/:courseId/statistics Course statistics
PATCH  /api/courses/:courseId/toggle-public Toggle public/private
POST   /api/courses/:courseId/clone     Clone a public course
GET    /api/courses/public              Browse all public courses
GET    /api/courses/public/:courseId    Get public course details
```

### Videos
```
POST   /api/videos/:courseId            Add video to course
GET    /api/videos/:courseId            Get all videos (authenticated)
GET    /api/videos/public/:courseId     Get videos of public course (no auth)
DELETE /api/videos/:videoId             Delete video
PATCH  /api/videos/:videoId/complete    Mark video as completed
PUT    /api/videos/:courseId/reorder    Reorder videos
```

### YouTube
```
GET    /api/youtube/search              Search videos with caching
GET    /api/youtube/smart-search        Search videos and playlists
POST   /api/youtube/import-video        Import video by URL
POST   /api/youtube/import-playlist     Import playlist by URL
```

### Q&A
```
GET    /api/questions/                  Get all questions
POST   /api/questions/                  Post a question
GET    /api/questions/video/:videoId    Questions for a video
GET    /api/questions/:questionId       Get question details
PUT    /api/questions/:questionId       Edit question
DELETE /api/questions/:questionId       Delete question
PATCH  /api/questions/:questionId/upvote
PATCH  /api/questions/:questionId/downvote

POST   /api/answers/                    Post an answer
GET    /api/answers/question/:questionId Answers for a question
PUT    /api/answers/:answerId           Edit answer
DELETE /api/answers/:answerId           Delete answer
PATCH  /api/answers/:answerId/accept    Accept answer
PATCH  /api/answers/:answerId/upvote
PATCH  /api/answers/:answerId/downvote
```

### Bookmarks & Notifications
```
POST   /api/bookmarks/:questionId       Bookmark a question
DELETE /api/bookmarks/:questionId       Remove bookmark
GET    /api/bookmarks/                  Get all bookmarks

GET    /api/notifications/              Get notifications
PATCH  /api/notifications/:id/read      Mark as read
PATCH  /api/notifications/mark-all-read Mark all as read
DELETE /api/notifications/:id           Delete a notification
```

---

## Database Schema

```
User
  ├── username, fullname, email, password (hashed)
  ├── isEmailVerified, emailVerificationToken, emailVerificationExpiry
  ├── resetPasswordToken, resetPasswordExpiry
  ├── refreshToken
  └── bookmarkedQuestions[]

Course
  ├── title, description
  ├── creator → User
  ├── isPublic, viewCount, cloneCount
  └── unique(title, creator)

Video
  ├── videoId (YouTube), title, thumbnail, duration, channelTitle
  ├── course → Course
  ├── isCompleted, order
  └── unique(videoId, course)

Question
  ├── title, body
  ├── video → Video, askedBy → User
  ├── upvotes[], downvotes[]
  └── acceptedAnswer → Answer

Answer
  ├── body
  ├── question → Question, answeredBy → User
  └── upvotes[], downvotes[]

Comment (model exists, not yet implemented)
  ├── text, commentedBy → User
  └── parentType (Question/Answer), parentId

YoutubeCache
  ├── query (search term)
  ├── videos[]
  └── timestamps (TTL)
```

---

## Setup & Installation

### Prerequisites
- Node.js v14+
- MongoDB (local or Atlas)
- YouTube Data API v3 key
- Gmail account with App Password for email

### Backend
```bash
cd server
npm install
# create .env file (see Environment Variables)
npm run dev
# runs on http://localhost:8000
```

### Frontend
```bash
cd client
npm install
# create .env file (see Environment Variables)
npm run dev
# runs on http://localhost:5173
```

---

## Environment Variables

### Backend — `server/.env`
```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
DB_NAME=your_database_name
CORS_ORIGIN=http://localhost:5173
ACCESS_TOKEN_SECRET=your_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_secret
REFRESH_TOKEN_EXPIRY=3d
YOUTUBE_API_KEY=your_youtube_api_key
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=http://localhost:5173
```

### Frontend — `client/.env`
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

---

## Known Issues

- `reorderVideos` controller uses `videoOrders` array format but frontend sends a flat array of IDs — needs alignment
- Comment system backend is fully implemented (controller + model) but routes and frontend UI are not connected yet
- Video completion is one-way only — cannot mark a video as incomplete once completed
- Course statistics not displayed on the Dashboard (API exists, UI not connected)

---

## Future Enhancements

### Learning Experience
- **Learning Roadmaps** — Generate structured topic paths (e.g., DSA roadmap) to guide beginners
- **Notes & Highlights** — Add timestamped notes to videos
- **Course Reviews & Ratings** — Let users rate and review public courses

### Search & Content
- **Advanced Search Filters** — Filter videos by difficulty or playlist length (duration filter already implemented)
- **Infinite Scroll** — Replace "Load More" button with auto-load on scroll (nextPageToken already implemented)
- **Trending Courses** — Show most viewed or cloned public courses (viewCount/cloneCount already tracked)

### Community
- **Comment System** — Backend fully implemented; routes and frontend UI pending
- **Reputation System** — Points or badges based on answers, votes, and contributions
- **Follow Users** — Follow instructors or contributors

### Analytics
- **Learning Dashboard** — Total watch time, streaks, and completion trends
- **Skill Tracking** — Track progress by topic (e.g., Graphs, Dynamic Programming)

### Collaboration
- **Shared Courses** — Collaborative course creation
- **Course Forking Improvements** — Track course lineage when cloned

### AI Features
- **AI Course Recommendations** — Suggest courses based on learning history
- **AI Video Summaries** — Generate summaries and key concepts from videos
- **AI Roadmap Generator** — Create learning paths from a user's goal

### Performance & Infrastructure
- **Redis Caching** — Improve API performance and reduce YouTube API quota usage
- **Rate Limiting** — Prevent API abuse
- **Search Indexing** — Use Elasticsearch for faster question search

### UX Improvements
- Dark Mode
- PWA Support (offline learning)
- Mobile-first UI improvements

---

## License

This project is personal and not open source. All rights reserved.  
Do not copy, distribute, or use any part of this codebase without explicit permission from the author.
