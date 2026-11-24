CREATE DATABASE IF NOT EXISTS lost_and_found_db;
USE lost_and_found_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(30) NOT NULL DEFAULT 'passenger',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lost_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  item_name VARCHAR(120) NOT NULL,
  category VARCHAR(80) NOT NULL,
  color VARCHAR(50) NOT NULL,
  route VARCHAR(100) NOT NULL,
  bus_time VARCHAR(50),
  lost_date DATE NOT NULL,
  description TEXT NOT NULL,
  reporter_name VARCHAR(120) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'searching',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_lost_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS found_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  item_name VARCHAR(120) NOT NULL,
  category VARCHAR(80) NOT NULL,
  color VARCHAR(50) NOT NULL,
  route VARCHAR(100) NOT NULL,
  bus_time VARCHAR(50),
  found_date DATE NOT NULL,
  description TEXT NOT NULL,
  reporter_name VARCHAR(120) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'stored',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_found_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS matches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lost_item_id INT NOT NULL,
  found_item_id INT NOT NULL,
  score DECIMAL(5,2) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_lost_found_match (lost_item_id, found_item_id),
  CONSTRAINT fk_match_lost FOREIGN KEY (lost_item_id) REFERENCES lost_items(id) ON DELETE CASCADE,
  CONSTRAINT fk_match_found FOREIGN KEY (found_item_id) REFERENCES found_items(id) ON DELETE CASCADE
);
