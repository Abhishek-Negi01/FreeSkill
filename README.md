# FreeSkill

A learning management platform that enables users to create personalized courses using YouTube videos, track their progress, and engage in technical discussions through an integrated Q&A system.

## Overview

FreeSkill addresses the challenge of organizing self-paced learning by allowing users to use YouTube content into structured courses, monitor completion status, and participate in a community-driven knowledge exchange similar to Stack Overflow.

**Target Users:** Self-learners, students, and professionals seeking to organize and track their learning journey across various technical topics.

## Core Features

### Authentication & User Management

- JWT-based authentication with access and refresh tokens
- Secure user registration and login
- Token refresh mechanism for session management

### Course Management

- Create, read, update, and delete courses
- User-specific course collections
- Course metadata including title and description

### Video Management

- Add YouTube videos to courses
- Store video metadata (title, thumbnail, duration, channel)
- Order videos within courses
- Remove videos from courses

### Progress Tracking

- Mark videos as completed
- Calculate course completion percentage
- Track learning progress per course

### YouTube Integration

- Search YouTube videos via YouTube Data API v3
- Fetch video details and metadata
- Direct integration with course creation workflow

### Q&A System

- Post questions related to videos or courses
- Answer questions from other users
- Upvote and downvote questions and answers
- Comment on questions and answers
- Accept answers (similar to Stack Overflow)

## Architecture

### Backend Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (jsonwebtoken, bcryptjs)
- **External API:** YouTube Data API v3

### Data Model Relationships

```
User
  └── Course (creator)
       └── Video
            └── Question
                 └── Answer
                      └── Comment
```

### Key Design Decisions

- Token-based authentication for stateless API design
- Compound indexes to prevent duplicate courses per user
- Populate queries for efficient data retrieval
- Middleware-based authentication for protected routes

## API Endpoints

### Authentication

```
POST   /api/users/register
POST   /api/users/login
POST   /api/users/logout
POST   /api/users/refresh-token
GET    /api/users/me
GET    /api/users/getAllUser
PUT    /api/users/updateUser
DELETE /api/users/deleteUser
```

### Course Management

```
POST   /api/courses/
GET    /api/courses/
GET    /api/courses/:courseId
PUT    /api/courses/:courseId
DELETE /api/courses/:courseId
GET    /api/courses/:courseId/progress
```

### Video Management

```
POST   /api/videos/:courseId
GET    /api/videos/:courseId
PATCH  /api/videos/:videoId
DELETE /api/videos/:videoId
PATCH  /api/videos/:videoId/complete
```

### Q&A System (Planned)

```
POST   /api/questions
GET    /api/questions/:videoId
POST   /api/answers/:questionId
POST   /api/votes
POST   /api/comments
```

## Database Schema

### User

- username, email, password (hashed)
- email verification status
- refresh token storage

### Course

- title, description
- creator reference (User)
- unique constraint on (title, creator)

### Video

- videoId (YouTube), title, thumbnail, duration, channelTitle
- course reference
- completion status, order
- unique constraint on (videoId, course)

### Question

- title, body
- video reference, askedBy reference
- upvotes, downvotes arrays
- acceptedAnswer reference

### Answer

- body
- question reference, answeredBy reference
- upvotes, downvotes arrays

### Comment

- text
- commentedBy reference
- parentType (Question/Answer), parentId

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- YouTube Data API key

### Setup

1. Clone the repository

```bash
git clone https://github.com/Abhishek-Negi01/FreeSkill.git
cd freeskill
```

2. Install dependencies

```bash
cd server
npm install
```

3. Configure environment variables

Edit `.env` with your configuration:

```
PORT=8000
MONGODB_URI=your_mongodb_connection_string
DB_NAME=your_database_name
CORS_ORIGIN=*
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=3d
YOUTUBE_API_KEY=your_youtube_api_key
```

4. Run the development server

```bash
npm run dev
```

The server will start on `http://localhost:8000`

## Development Phases

### Phase 1: Authentication & User Management (Completed)

- User registration and login
- JWT token generation and validation
- Refresh token mechanism
- Protected route middleware

### Phase 2: Course & Video CRUD (Completed)

- Course creation and management
- Video addition to courses
- CRUD operations for both entities

### Phase 3: Progress Tracking (Completed)

- Video completion tracking
- Course progress calculation
- User progress dashboard

### Phase 4: YouTube Integration (Planned)

- YouTube search API integration
- Video metadata fetching
- Direct add-to-course functionality

### Phase 5: Q&A System (Planned)

- Question posting and answering
- Voting mechanism
- Comment system
- Accepted answer feature

### Phase 6: Enhancements (Future)

- AI-based course recommendations
- Learning analytics dashboard
- Email notifications
- Social sharing features

## Tech Stack

**Backend**

- Node.js
- Express.js
- MongoDB
- Mongoose

**Authentication**

- JWT (jsonwebtoken)
- bcryptjs

**External APIs**

- YouTube Data API v3

**Development Tools**

- Nodemon
- dotenv
- cookie-parser
- cors

## Future Improvements

- **AI Recommendations:** Machine learning-based course and video suggestions
- **Analytics Dashboard:** Detailed learning statistics and insights
- **Role-Based Access:** Admin, instructor, and student roles
- **Caching Layer:** Redis integration for improved performance
- **Real-time Features:** WebSocket-based notifications and live Q&A
- **Mobile Application:** React Native mobile client
- **Content Moderation:** Automated and manual content review system

## License

MIT
