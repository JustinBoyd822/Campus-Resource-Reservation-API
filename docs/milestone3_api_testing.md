# Milestone 3 API Testing

Tested with Postman against http://localhost:3000.

POST /api/users
Creates a new user in the system. Returns 201 with the new user_id.

GET /api/users
Returns all users.

POST /api/resources
Creates a new reservable resource. Returns 201 with the new resource_id.

GET /api/resources
Returns all available resources.

POST /api/reservations
Creates a reservation for a user and a resource. Returns 201 with the new reservation_id.

GET /api/reservations
Returns all reservations.
