# Milestone 4 Testing Notes

Tested with Postman against http://localhost:3000.

## 1. Request that fails validation
POST /api/users with body:
{ "full_name": "Test User" }

Result: 400 Bad Request
{ "error": "Missing required field: email" }

The validateRequest middleware stops the request before it reaches the database.

## 2. Handled server error
POST /api/users with an email that already exists (UNIQUE constraint):
{ "full_name": "Another Jordan", "email": "jordan.smith@madonna.edu" }

Result: 500 Internal Server Error
{ "error": "An unexpected server error occurred" }

MySQL rejects the duplicate email, the route passes the error to next(err), and errorHandler.js logs it and sends the generic response.

## 3. Successful request after validation
POST /api/users with body:
{ "full_name": "Test User", "email": "test.user@madonna.edu" }

Result: 201 Created with the new user_id.

## Business rules checked
- POST /api/reservations with end_time earlier than start_time returns 400 ("end_time must be after start_time").
- POST /api/reservations with a resource_id that does not exist returns 404 ("Resource not found").
- POST /api/reservations that overlaps an existing active reservation for the same resource returns 409.
