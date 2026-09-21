# Campus Resource Reservation API

## Description
A backend-only API for managing reservable campus resources such as study rooms, lab spaces, and equipment. Users will be able to view resource availability and create, update, and cancel reservations. This project is being built incrementally as part of a backend development course.

## Scope
**In scope:**
- Managing campus resources (study rooms, lab spaces, equipment)
- Creating, viewing, updating, and canceling reservations
- Checking resource availability

**Out of scope (for now):**
- User authentication/authorization
- Payment processing
- Frontend/UI
- Notifications (email/SMS)

The purpose of this system is to solve the problem of coordinating limited, shared campus resources among multiple users in an organized, conflict-free way, not to serve as a full-featured campus portal.

## Technologies Used
- Node.js
- Express.js
- MySQL
- Git / GitHub
- Postman (for later testing)

Using a consistent toolset across the course matters because backend development rarely happens in isolation. In a real job, developers inherit existing codebases, work alongside teammates, and follow whatever stack a company has already standardized on. Sticking to one set of tools throughout this course mirrors that reality: it builds familiarity with a specific environment, makes debugging predictable since everyone hits the same kinds of issues, and reinforces good habits like using Git properly and structuring an Express app consistently.

## Running the Server Locally

### Prerequisites
- Node.js (v18 or newer) and npm
- MySQL (8.0.16 or newer recommended so CHECK constraints are enforced)
- Git

### Steps
1. Clone the repo:
```
   git clone https://github.com/JustinBoyd822/Campus-Resource-Reservation-API.git
   cd Campus-Resource-Reservation-API
```
2. Install dependencies:
```
   npm install
```
3. (Optional) To use a different port, create a `.env` file in the project root:
```
   PORT=3000
```
   If no `.env` file is present, the server uses port 3000 by default.
4. Start the server:
```
   npm start
```
   To restart automatically when files change, use `npm run dev` instead.
5. Test that it works by opening this in your browser or Postman:
```
   http://localhost:3000/health
```
   You should get a response confirming the server is running.

## Database Setup
The MySQL schema is in `database/milestone2_schema.sql`. To create the database and tables, run:
```
mysql -u root -p < database/milestone2_schema.sql
```
Running the script drops and recreates the `campus_reservation` database, so it is safe to re-run but will erase existing data. To check that it worked, log in to MySQL and run:
```
USE campus_reservation;
SHOW TABLES;
SELECT * FROM reservations;
```

### Schema Overview
- `users` - people who can log in and make reservations (name, unique email, role)
- `resources` - reservable rooms and equipment (name, type, location, description, capacity, active flag)
- `reservations` - a user's booking of a resource for a time range (start and end time, purpose, status)

Each reservation links to one user and one resource through foreign keys. The schema also includes CHECK constraints that require a reservation's end time to be after its start time, limit reservation status to `active`, `cancelled`, or `completed`, and require capacity to be greater than zero. A design explanation is in `docs/milestone2_design_explanation.md`.

## Project Structure
- `server.js` - server entry point
- `src/routes` - route definitions
- `src/controllers` - request handling logic
- `src/models` - database models
- `src/middleware` - middleware functions
- `src/config` - configuration
- `database/` - MySQL schema
- `docs/` - design documentation

## Current Project Status
**Module 1 (complete):** Express server foundation
- Node.js project initialized with Express installed and configured
- Server starts without errors and listens on a defined port
- Working health route (`/health`) for testing
- Folder structure set up for routes, controllers, models, middleware, and config

**Module 2 (complete):** Database schema design
- MySQL schema for users, resources, and reservations
- Constraints to prevent bad data and extra fields for realism
- Design explanation documented in `docs/`

**Not built yet:** database connection from the server, API endpoints for resources and reservations, double-booking prevention, and authentication. These will be added in later modules.
