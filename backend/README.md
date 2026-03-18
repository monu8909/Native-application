# Home Decoration Backend

Node.js + Express + MongoDB backend for the Home Decoration & Interior Design app.

## Quick start

1. Install deps:

```bash
cd backend
npm install
```

2. Create `.env`:

- Copy `backend/.env.example` to `backend/.env`
- Fill `MONGODB_URI`, `JWT_*`, and (optionally) Cloudinary values

3. Run:

```bash
npm run dev
```

Health check: `GET /health`

## Auth

- **Request OTP**: `POST /api/auth/otp/request`
  - Body: `{ "phone": "+919999999999" }`
- **Verify OTP**: `POST /api/auth/otp/verify`
  - Body: `{ "phone": "+919999999999", "code": "123456", "name": "Aman" }`
  - Returns: `{ accessToken, refreshToken, user }`
- **Login (worker/admin)**: `POST /api/auth/login`
  - Body: `{ "phoneOrEmail": "...", "password": "..." }`
- **Refresh**: `POST /api/auth/refresh`
- **Logout**: `POST /api/auth/logout`

Send access token via header:

`Authorization: Bearer <accessToken>`

## Bookings (customer)

- `GET /api/bookings` (my bookings)
- `POST /api/bookings` (create)
- `GET /api/bookings/:id` (my booking / assigned worker / admin)

## Worker

- `GET /api/workers/me/tasks`
- `PATCH /api/workers/tasks/:id/start`
- `PATCH /api/workers/tasks/:id/complete`

## Admin

- `GET /api/admin/dashboard`
- Workers CRUD:
  - `GET /api/admin/workers`
  - `POST /api/admin/workers`
  - `PATCH /api/admin/workers/:id`
  - `DELETE /api/admin/workers/:id` (soft disable)
- Bookings:
  - `GET /api/admin/bookings`
  - `PATCH /api/admin/bookings/:id`
  - `POST /api/admin/bookings/:id/assign`

## Upload (Cloudinary)

`POST /api/uploads/cloudinary` (multipart form-data)

- Field: `file`
- Optional body: `folder`

## Real-time updates (Socket.IO)

Clients can `join` rooms:

- `booking:<bookingId>`
- `worker:<workerId>` (reserved for worker notifications)

Server emits:

- `booking:update`

