\# Milestone 2: Database Schema Design Explanation



\## Entities I Designed

\- Users: The people who log in and make reservations. Each user has a name, a unique email, and a role that defaults to student. Every reservation needs an owner, so this table anchors everything else.

\- Resources: The rooms and equipment that can be reserved. Each has a name, type, location, and active flag, and I added a description and a capacity so a room can be described realistically. Without this table there would be nothing to reserve.

\- Reservations: The core of the system and the only table that connects the other two. It records who reserved what, when it starts and ends, why it was reserved, and whether it is still active.



\## Relationships

\- A reservation connects to a user through user\_id, a foreign key to the users table. One user can hold many reservations, but each reservation belongs to exactly one user.

\- A reservation connects to a resource through resource\_id, a foreign key to the resources table. One resource can be reserved many times, but each reservation is for exactly one resource. This makes reservations the link between users and resources.

\- Both foreign keys use ON DELETE CASCADE, so removing a user or a resource also removes their reservations.



\## Assumptions

\- Any registered user can reserve a resource.

\- Double booking should not be allowed. The schema does not prevent overlapping times yet, so I expect to enforce that at the API layer.

\- A reservation is a single continuous block of time, and its end must come after its start.

\- Equipment has no capacity, so that column is NULL for equipment instead of zero.

\- Cancelling a reservation should change its status rather than delete it, so a record remains.



\## One Design Decision I Made

I added a CHECK constraint requiring end\_time to come after start\_time. A reservation that ends before it begins is meaningless, and it is better for the database to reject it than to rely on every future piece of code to catch it. I limited status to active, cancelled, or completed for the same reason: a typo should not be able to create a status the system does not recognize.

