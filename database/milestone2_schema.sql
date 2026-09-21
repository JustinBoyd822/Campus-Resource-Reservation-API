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
-- OPTIONAL: Sample data for testing your schema
-- You may keep or remove this section
-- ---------------------------------------------------
INSERT INTO users (full_name, email, role) VALUES
('Jordan Smith', 'jordan.smith@madonna.edu', 'student'),
('Casey Lee', 'casey.lee@madonna.edu', 'admin');
 
INSERT INTO resources (resource_name, resource_type, location) VALUES
('Study Room A', 'study_room', 'Library'),
('Camera Kit 1', 'equipment', 'Media Center');
 
INSERT INTO reservations (user_id, resource_id, start_time, end_time, status) VALUES
(1, 1, '2026-02-01 10:00:00', '2026-02-01 11:00:00', 'active');