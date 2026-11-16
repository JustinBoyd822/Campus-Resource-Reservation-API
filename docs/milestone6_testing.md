# Milestone 6 Testing Notes

Tested with Postman/curl against http://localhost:3000. Logs below are copied from the server console.

## What changed
- `src/middleware/requestLogger.js` logs every request (timestamp, method, path). Registered first in `app.js`, before all routes.
- `src/middleware/errorHandler.js` is the one place errors are handled. Registered last in `app.js`, after all routes.
- Unknown routes now forward a 404 error to the error handler.
- Routes use `try/catch` and `next(err)` (`/auth`, `/api/resources`, `/api/reservations`, `/api/users`).
- Validation messages were shortened and made consistent (`<field> is required`).

## 1. Example of a logged request
Request: `GET /health`

Console output:
```
[2026-11-15T23:01:35.093Z] GET /health
```
Every request prints one line in the format `[timestamp] METHOD /path`.

## 2. Example of a handled error response
Request: `GET /api/resources` while MySQL was not running (simulated database failure).

Response: 500 Internal Server Error
```json
{ "error": "Internal server error" }
```

Console output (the real error stays on the server only):
```
[2026-11-15T23:01:35.281Z] GET /api/resources
[2026-11-15T23:01:35.292Z] ERROR 500 GET /api/resources - connect ECONNREFUSED 127.0.0.1:3306
```
The client only sees a generic message. No stack trace or database details are sent. The next request, `GET /health`, still returned 200, so the server kept running.

Other handled errors:

| Request | Status | Response |
|---|---|---|
| `GET /nope` (unknown route) | 404 | `{ "error": "Route not found" }` |
| `POST /auth/login` with broken JSON | 400 | `{ "error": "Request body contains invalid JSON" }` |

## 3. Examples of validation errors
POST /api/reservations (valid token, no `start_time`)
```json
{ "resource_id": 1, "end_time": "2026-12-01 11:00:00" }
```
Result: 400 Bad Request
```json
{ "error": "start_time is required" }
```

POST /api/reservations (`end_time` before `start_time`)

Result: 400 Bad Request
```json
{ "error": "end_time must be after start_time" }
```

POST /auth/register (missing email)

Result: 400 Bad Request
```json
{ "error": "email is required" }
```

POST /auth/register (`"email": "nope"`)

Result: 400 Bad Request
```json
{ "error": "email must be a valid email address" }
```

POST /api/resources (admin token, `"resource_name": 123`)

Result: 400 Bad Request
```json
{ "error": "resource_name and resource_type must be text" }
```

## 4. Reliability check
I sent all of the invalid requests above one after another, then called `GET /health`.
The server returned `200 OK` and did not crash. Every request and error appeared in the console.
