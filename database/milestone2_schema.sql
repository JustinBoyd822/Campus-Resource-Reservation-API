-- CSC 3210 Application Development I Backend
-- Project: Campus Resource Reservation API
-- Milestone 2: Database Schema Design
-- Database: MySQL

-- If you want to re-run this script safely:
DROP DATABASE IF EXISTS campus_reservation;
CREATE DATABASE campus_reservation;
USE campus_reservation;

-- ---------------------------------------------------
-- Table: users
-- Stores people who can log in and make reservations
-- ---------------------------------------------------
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  role VARCHAR(30) NOT NULL DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------
-- Table: resources
-- Stores reservable items such as rooms and equipment
-- ---------------------------------------------------
CREATE TABLE resources (
  resource_id INT AUTO_INCREMENT PRIMARY KEY,
  resource_name VARCHAR(120) NOT NULL,
  resource_type VARCHAR(50) NOT NULL,
  location VARCHAR(120) NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------
-- Table: reservations
-- Stores reservations made by users for resources
-- ---------------------------------------------------
CREATE TABLE reservations (
  reservation_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  resource_id INT NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_reservations_users
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON DELETE CASCADE,

  CONSTRAINT fk_reservations_resources
    FOREIGN KEY (resource_id) REFERENCES resources(resource_id)
    ON DELETE CASCADE
);

-- Helpful indexes for common lookups
CREATE INDEX idx_reservations_user ON reservations(user_id);
CREATE INDEX idx_reservations_resource ON reservations(resource_id);
CREATE INDEX idx_reservations_time ON reservations(start_time, end_time);

-- ---------------------------------------------------
-- My improvements
-- ---------------------------------------------------

-- New fields to improve realism
ALTER TABLE reservations
  ADD COLUMN purpose VARCHAR(255) NULL;

ALTER TABLE resources
  ADD COLUMN description VARCHAR(255) NULL,
  ADD COLUMN capacity INT NULL;

-- Constraints that prevent bad data
ALTER TABLE reservations
  ADD CONSTRAINT chk_reservation_time
  CHECK (end_time > start_time);

ALTER TABLE reservations
  ADD CONSTRAINT chk_reservation_status
  CHECK (status IN ('active', 'cancelled', 'completed'));

ALTER TABLE resources
  ADD CONSTRAINT chk_resources_capacity
  CHECK (capacity IS NULL OR capacity > 0);

INSERT INTO users (full_name, email, role) VALUES
('Jordan Smith', 'jordan.smith@madonna.edu', 'student'),
('Casey Lee', 'casey.lee@madonna.edu', 'admin');

INSERT INTO resources (resource_name, resource_type, location, description, capacity) VALUES
('Study Room A', 'study_room', 'Library', 'Quiet group study room with whiteboard', 6),
('Camera Kit 1', 'equipment', 'Media Center', 'DSLR camera, tripod, and two lenses', NULL);

INSERT INTO reservations (user_id, resource_id, start_time, end_time, purpose, status) VALUES
(1, 1, '2026-02-01 10:00:00', '2026-02-01 11:00:00', 'Group project meeting', 'active');