# FreeSkill — TODO

Priority order: Critical → High → Medium → Low → Future Features

---

## 🔴 Critical

**All critical issues have been resolved! ✅**

---

## 🟠 High

**All high priority issues have been resolved! ✅**

---

## 🟡 Medium

**All medium priority issues have been resolved! ✅**

---

## 🔵 Low (UI Issues - Fix Later)

### 6. `ProtectedRoute.jsx` and `PublicRoute.jsx` — Old CSS Spinner Class

Both use `className="spinner"` which is an old CSS class that no longer exists. Loading screen is broken.

**Fix:** Replace with:

```jsx
<div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
```

---

### 7. Mobile Video UI

**File:** `CourseDetails.jsx`

Fixed `maxHeight` on playlist cuts it off on mobile. No prev/next buttons. Buttons too small.

**Fix:**

- Remove fixed `maxHeight` on mobile
- Add Player/Playlist tab switcher on mobile
- Add Prev/Next video buttons below player
- Full-width action buttons on mobile

---

### 8. Comments UI

**File:** `QuestionDetail.jsx`

Comment backend is fully wired and fixed. Zero frontend UI exists.

**Fix:** Add collapsible comment section below each answer — show comments, add/edit/delete own comments.

---

## 🚀 Future Features

### F1. Timestamped Notes on Videos

While watching, users add notes tied to a timestamp. Notes saved per video per user, shown as a timeline. Click a note to seek the video.

- New `Note` model: `{ userId, videoId, timestamp (seconds), text }`
- Backend CRUD: `POST/GET/PUT/DELETE /api/notes`
- Frontend: "Add Note" button captures current YouTube player time via IFrame API, notes panel alongside playlist

---

### F2. Personal Todo List per Course

Each course has a personal task list for exercises, goals, reminders.

- New `Todo` model: `{ userId, courseId, text, isCompleted }`
- Backend CRUD: `POST/GET/PATCH(toggle)/DELETE /api/todos`
- Frontend: collapsible "My Tasks" panel in `CourseDetails.jsx` sidebar

---

### F3. Learning Roadmaps

Structured topic paths (e.g. "Learn DSA: Arrays → Trees → Graphs → DP"). Each step links to a course.

- New `Roadmap` model with ordered steps
- Public roadmaps browsable by all users
- Progress tracking per step per user

---

### F4. AI Video Summaries

Generate summary + key takeaways for any video using OpenAI/Gemini. Cached on the Video document after first generation.

- Backend: `POST /api/ai/summarize` — fetches transcript, sends to AI, caches result
- Frontend: "Summarize" button below player in `CourseDetails.jsx`

---

### F5. AI Roadmap Generator

User types a learning goal, AI generates a structured roadmap and auto-fills steps with matching public courses.

- Backend: `POST /api/ai/generate-roadmap`
- Frontend: `/roadmaps/generate` page

---

### F6. Course Reviews & Ratings

1–5 star ratings + written reviews on public courses. Average rating shown on course cards.

- New `Review` model: `{ userId, courseId, rating, text }` with unique index
- `Course` model: add `averageRating`, `reviewCount`
- Frontend: star input + review list on `PublicCourseDetail.jsx`

---

### F7. Trending Courses

"Trending This Week" section on public courses page. `viewCount` and `cloneCount` already tracked.

- Backend: `GET /api/courses/trending` — top 6 by combined score
- Frontend: horizontal scroll row at top of `PublicCourses.jsx`

---

### F8. Infinite Scroll

Replace "Load More" buttons with auto-load on scroll. `nextPageToken` already implemented on backend.

- Use `IntersectionObserver` on a sentinel div
- Applies to: `YouTubeSearch.jsx`, `SmartSearch.jsx`, `PublicCourses.jsx`

---

### F9. Dark Mode

Full dark mode with Tailwind `dark:` classes. Preference saved to `localStorage`.

---

### F10. Reputation & Badges

Points for asking, answering, receiving upvotes, getting answers accepted. Badges at milestones.

- Uses the slim `User` model (`clerkId`, `reputation`)
- Point rules: +5 ask, +10 answer, +5 upvote received, +15 answer accepted, -2 downvote received
- Show reputation next to usernames in Q&A and on Profile page

---

### F11. Follow Users

Follow other users to see their public courses and questions in a feed.

- New `Follow` model: `{ followerId, followingId }`
- `/feed` page showing activity from followed users

---

### F12. Shared / Collaborative Courses

Invite other users to co-edit a course.

- `Course` model: add `collaborators: [String]` (Clerk userIds)
- Auth check: allow edit if `userId === creator OR collaborators.includes(userId)`

---

### F13. Learning Analytics Dashboard

Personal stats — total watch time, daily streak, completion trends, most active topics.

- Add `completedAt: Date` to Video model (currently only `isCompleted: Boolean`)
- Backend: `GET /api/analytics/me`
- Frontend: `/analytics` page with charts (recharts)

---

### F14. PWA Support

Installable app with offline access to courses and notes.

- `manifest.json` + Vite PWA plugin service worker
- Cache course data, video metadata, notes offline

---

### F15. Redis Caching

Replace MongoDB TTL YouTube cache with Redis. Also cache public course list responses.

- Upstash Redis (serverless) or self-hosted
- Replace `YoutubeCache` model with Redis `SET`/`GET` with TTL

---

### F16. Rate Limiting

Prevent YouTube API quota abuse and Q&A spam.

- `express-rate-limit` on YouTube search routes (20 req/min per IP)
- Moderate limit on question/answer POST routes (10 req/min per user)

---

## ✅ Recently Completed

### 1. Delete User Account — ✅ IMPLEMENTED

- Added `DELETE /api/users/` route with proper authentication
- Controller cascades delete from Clerk and MongoDB (courses, videos, questions, answers, bookmarks, notifications)
- Frontend: Profile page with confirmation modal and structured hooks
- **Files:** `user.controllers.js`, `Profile.jsx`, `useProfile.js`, `DeleteAccountModal.jsx`

### 2. Toggle Accept Answer — ✅ IMPLEMENTED

- Backend now toggles between accept/unaccept with proper field names
- Frontend shows Accept/Unaccept button with dynamic styling
- Proper toast messages for both actions
- **Files:** `answer.controllers.js`, `QuestionDetail.jsx`, `useAnswers.js`

### 3. Video Completion Toggle — ✅ IMPLEMENTED

- Backend toggles `isCompleted` status properly
- Frontend updates UI in real-time with correct status
- **Files:** `video.controllers.js`, `useVideos.js`

### 4. Reorder Videos API Fix — ✅ IMPLEMENTED

- Backend accepts both `videoIds` array and legacy `videoOrders` format
- Frontend sends flat array of IDs correctly
- **Files:** `video.controllers.js`, `videos.js`

### 5. Course Statistics on Dashboard — ✅ IMPLEMENTED

- Dashboard now shows video count, duration, and completion stats per course
- Uses structured hooks and services pattern
- **Files:** `Dashboard.jsx`, `useCourses.js`

### 6. Code Structure Improvements — ✅ IMPLEMENTED

- Refactored QuestionDetail.jsx with custom hooks (`useQuestionDetail`, `useAnswers`, `useQuestionEdit`, `useAnswerEdit`)
- Created proper service layers for API calls
- VideoQuestions.jsx now uses structured hooks
- Profile.jsx follows proper hook and service patterns

---

## Notes

- **All critical bugs fixed!** ✅ Core functionality now working properly
- **Code structure improved** — Proper separation of concerns with hooks and services
- **Ready for new features** — Solid foundation for future development
- **Next focus:** Low priority UI improvements or Future Features (F1-F16)
