CREATE DATABASE IF NOT EXISTS lost_and_found_db;
USE lost_and_found_db;

-- The Flask application also creates these tables automatically.
-- This SQL file is included for reference/manual database setup.

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lost_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(120) NOT NULL,
    item_type VARCHAR(80) NOT NULL,
    brand VARCHAR(100),
    color VARCHAR(60),
    description TEXT,
    bus_number VARCHAR(50),
    lost_location VARCHAR(150),
    lost_date DATE NOT NULL,
    lost_time TIME,
    owner_name VARCHAR(120) NOT NULL,
    owner_contact VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'LOST',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS found_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(120) NOT NULL,
    item_type VARCHAR(80) NOT NULL,
    brand VARCHAR(100),
    color VARCHAR(60),
    description TEXT,
    bus_number VARCHAR(50),
    found_location VARCHAR(150),
    found_date DATE NOT NULL,
    found_time TIME,
    found_by VARCHAR(120) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'FOUND',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS matches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lost_item_id INT NOT NULL,
    found_item_id INT NOT NULL,
    match_score DECIMAL(5,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    reviewed_by INT NULL,
    reviewed_at DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_matches_lost FOREIGN KEY (lost_item_id) REFERENCES lost_items(id),
    CONSTRAINT fk_matches_found FOREIGN KEY (found_item_id) REFERENCES found_items(id),
    CONSTRAINT fk_matches_reviewer FOREIGN KEY (reviewed_by) REFERENCES users(id)
);
