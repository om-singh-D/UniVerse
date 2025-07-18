# UniVerse Backend: All Major Dataflows

## 1. Authentication (Login/Register/OAuth)

- **Client →** `POST /api/v1/auth/login` or `/register` or `/oauth/*`
- `src/routes/auth.ts` (routes request)
- `src/middleware/validation.ts` (input validation)
- `src/controllers/auth/login.ts`, `register.ts`, or `oauth.ts` (handles)
- `src/services/auth.service.ts` (business logic)
- `src/utils/password.ts` (hash/check password)
- `src/utils/jwt.ts` (generate/verify token)
- `src/config/database.ts` (Prisma DB access)
- `src/utils/response.ts` (format response)
- **→ Client**

---

## 2. Profile Management

- **Client →** `GET /api/v1/auth/profile` or `PUT /api/v1/auth/profile`
- `src/routes/auth.ts`
- `src/middleware/auth.ts` (JWT authentication)
- `src/controllers/auth/profile.ts`
- `src/services/user.service.ts`
- `src/config/database.ts`
- `src/utils/response.ts`
- **→ Client**

---

## 3. Anonymous Confessions

- **Client →** `POST /api/v1/confessions`
- `src/routes/confessions.ts`
- `src/middleware/auth.ts` (if required), `src/middleware/validation.ts`
- `src/controllers/confessions/*`
- `src/services/confession.service.ts`
- `src/config/database.ts`
- `src/services/notification.service.ts` (optional: notify admins/moderators)
- `src/utils/response.ts`
- **→ Client**

---

## 4. Marketplace (Item CRUD, Image Upload)

- **Client →** `POST /api/v1/marketplace` or `GET /api/v1/marketplace`
- `src/routes/marketplace.ts`
- `src/middleware/auth.ts` (for protected actions), `src/middleware/validation.ts`
- `src/controllers/marketplace/*`
- `src/services/marketplace.service.ts`
- `src/services/upload.service.ts` (for images/files)
- `src/config/upload.ts` or AWS S3 via config
- `src/config/database.ts`
- `src/utils/response.ts`
- **→ Client**

---

## 5. Study Groups

- **Client →** `POST /api/v1/groups`
- `src/routes/groups.ts`
- `src/middleware/auth.ts`, `src/middleware/validation.ts`
- `src/controllers/groups/*`
- `src/services/group.service.ts`
- `src/config/database.ts`
- `src/utils/response.ts`
- **→ Client**

---

## 6. Campus Events

- **Client →** `POST /api/v1/events`
- `src/routes/events.ts`
- `src/middleware/auth.ts`, `src/middleware/validation.ts`
- `src/controllers/events/*`
- `src/services/event.service.ts`
- `src/services/notification.service.ts` (if event notification sent)
- `src/config/database.ts`
- `src/utils/response.ts`
- **→ Client**

---

## 7. Notifications

- **Client →** `GET /api/v1/notifications`
- `src/routes/notifications.ts`
- `src/middleware/auth.ts`
- `src/controllers/notifications/*`
- `src/services/notification.service.ts`
- `src/config/database.ts` or Redis (if used for real-time)
- `src/utils/response.ts`
- **→ Client**

---

## 8. Admin Panel (User Management, Moderation, Analytics)

- **Client →** `/api/v1/admin/*`
- `src/routes/admin.ts`
- `src/middleware/auth.ts`, `src/middleware/admin.ts`
- `src/controllers/admin/users.ts`, `moderation.ts`, `analytics.ts`
- `src/services/*`
- `src/config/database.ts`
- `src/utils/response.ts`
- **→ Client**

---

## 9. File Upload (General)

- **Client →** `POST /api/v1/upload`
- `src/routes/upload.ts`
- `src/middleware/auth.ts`, `src/middleware/upload.ts`
- `src/controllers/upload.ts`
- `src/services/upload.service.ts`
- `src/config/upload.ts` (S3/local)
- `src/utils/response.ts`
- **→ Client**

---

## 10. General Error Handling

- Any error in controller/service/DB
- Passed to `next()` in Express
- `src/middleware/errorHandler.ts` formats error response
- **→ Client**

---

## 11. Health Check

- **Client →** `GET /health`
- Handled directly in `src/app.ts`
- Returns JSON status

---

## 12. Utility Layers

- All flows may use:
    - `src/utils/response.ts` (formatting)
    - `src/utils/pagination.ts` (for paginated endpoints)
    - `src/utils/constants.ts`
    - Type definitions from `src/types/`
    - Configuration from `src/config/`

---

# Notes

- All API endpoints are versioned (e.g., `/api/v1/feature`)
- Most flows use middleware for validation, authentication, and error handling.
- Business logic is always separated into `services/`, while `controllers/` keep request/response logic.
- TypeScript types (`src/types/`) ensure consistent and safe data handling.