-- CSC 3210 Application Development I Backend
-- Milestone 5: Authentication and Authorization
-- Run AFTER milestone2_schema.sql:
--   mysql -u root -p campus_reservation < database/milestone5_auth.sql

USE campus_reservation;

-- Part A: roles are now 'user' and 'admin' (the old default was 'student')
ALTER TABLE users MODIFY COLUMN role VARCHAR(20) NOT NULL DEFAULT 'user';
UPDATE users SET role = 'user' WHERE role = 'student';

-- Part B: store a bcrypt hash, never the plain-text password.
-- Nullable so the seed users from Milestone 2 (who have no password) still exist.
ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) NULL;

-- Only allow the two valid roles
ALTER TABLE users
  ADD CONSTRAINT chk_users_role CHECK (role IN ('user', 'admin'));

-- To create an admin: register normally through POST /auth/register, then run:
--   UPDATE users SET role = 'admin' WHERE email = 'your_email@example.com';
