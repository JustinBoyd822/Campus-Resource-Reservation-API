# Milestone 5 Testing Notes

Tested with Postman against http://localhost:3000.

Setup: ran `database/milestone5_auth.sql`, created a `.env` with `JWT_SECRET`, and promoted one account to admin with
`UPDATE users SET role = 'admin' WHERE email = 'admin@madonna.edu';`

## 1. Register (password is hashed)
POST /auth/register
{ "full_name": "Test Student", "email": "student@madonna.edu", "password": "password123" }

Result: 201 Created
{ "user_id": 3, "role": "user" }

In MySQL, the `password_hash` column holds a bcrypt hash (starts with `$2b$`), not the plain text.
Registering the same email again returns 409.

## 2. Successful login
POST /auth/login
{ "email": "student@madonna.edu", "password": "password123" }

Result: 200 OK
{ "token": "eyJhbGciOiJIUzI1NiIs..." }

A wrong password or unknown email returns 401 { "error": "Invalid email or password" }.

## 3. Protected route with a valid token
POST /api/reservations
Header: Authorization: Bearer <student token>
{ "resource_id": 1, "start_time": "2026-12-01 10:00:00", "end_time": "2026-12-01 11:00:00" }

Result: 201 Created
{ "reservation_id": 2 }

The reservation is created for the user in the token, so no user_id is sent in the body.

## 4. Protected route with no token
POST /api/reservations (no Authorization header)

Result: 401 Unauthorized
{ "error": "Missing authorization header" }

A bad or expired token returns 401 { "error": "Invalid token" }.

## 5. Access denied because of the wrong role
POST /api/resources
Header: Authorization: Bearer <student token>
{ "resource_name": "Study Room B", "resource_type": "study_room" }

Result: 403 Forbidden
{ "error": "Access denied" }

The same request with the admin's token returns 201 Created with the new resource_id.

## Protected routes summary
| Route | Rule |
|---|---|
| POST /api/reservations | any logged-in user |
| POST /api/resources | admin only |
| GET /api/users | admin only |
| POST /api/users | admin only |
