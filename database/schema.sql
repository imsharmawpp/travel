CREATE DATABASE IF NOT EXISTS travel_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE travel_portal;

CREATE TABLE IF NOT EXISTS packages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  package_code VARCHAR(40),
  destination VARCHAR(120) NOT NULL,
  country VARCHAR(100),
  state VARCHAR(100),
  city VARCHAR(100),
  duration_days INT DEFAULT 1,
  duration_nights INT DEFAULT 0,
  starting_price DECIMAL(12,2) NOT NULL DEFAULT 0,
  offer_price DECIMAL(12,2) NULL,
  package_type VARCHAR(80) DEFAULT 'Holiday',
  category VARCHAR(40) DEFAULT 'Domestic',
  banner_url TEXT,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS itineraries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  package_id INT NOT NULL,
  day_number INT NOT NULL,
  title VARCHAR(180) NOT NULL,
  description TEXT,
  FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS inclusions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  package_id INT NOT NULL,
  item VARCHAR(200) NOT NULL,
  is_included TINYINT(1) DEFAULT 1,
  FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS addons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  package_id INT NOT NULL,
  name VARCHAR(180) NOT NULL,
  price DECIMAL(12,2) DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS hotels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  property_code VARCHAR(40),
  star_rating INT DEFAULT 3,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100),
  country VARCHAR(100) NOT NULL,
  address TEXT,
  amenities JSON,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS room_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  hotel_id INT NOT NULL,
  name VARCHAR(160) NOT NULL,
  description TEXT,
  base_price DECIMAL(12,2) DEFAULT 0,
  capacity INT DEFAULT 2,
  FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id VARCHAR(40) NOT NULL UNIQUE,
  customer_name VARCHAR(160) NOT NULL,
  customer_email VARCHAR(180) NOT NULL,
  customer_phone VARCHAR(40) NOT NULL,
  package_id INT NULL,
  hotel_id INT NULL,
  travel_date DATE NOT NULL,
  guests_adults INT DEFAULT 1,
  guests_children INT DEFAULT 0,
  guests_infants INT DEFAULT 0,
  total_price DECIMAL(12,2) DEFAULT 0,
  amount_paid DECIMAL(12,2) DEFAULT 0,
  payment_status ENUM('pending','partial','paid') DEFAULT 'pending',
  booking_status ENUM('pending','confirmed','cancelled','completed') DEFAULT 'pending',
  special_requests TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE SET NULL,
  FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(160) NOT NULL,
  customer_email VARCHAR(180) NOT NULL,
  customer_phone VARCHAR(40) NOT NULL,
  source VARCHAR(80) DEFAULT 'website',
  enquiry_details TEXT,
  status ENUM('new','contacted','won','lost') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS coupons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(40) NOT NULL UNIQUE,
  discount_type ENUM('percentage','fixed') NOT NULL,
  discount_value DECIMAL(12,2) NOT NULL,
  max_discount DECIMAL(12,2) NULL,
  min_booking_amount DECIMAL(12,2) DEFAULT 0,
  valid_until DATE NULL,
  is_active TINYINT(1) DEFAULT 1
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS payment_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  advance_percentage DECIMAL(5,2) NOT NULL,
  description TEXT,
  is_active TINYINT(1) DEFAULT 1
) ENGINE=InnoDB;

INSERT INTO packages (name, slug, package_code, destination, country, state, city, duration_days, duration_nights, starting_price, offer_price, package_type, category, banner_url) VALUES
('Kashmir Premium Escape', 'kashmir-premium-escape', 'KASH01', 'Kashmir', 'India', 'Jammu and Kashmir', 'Srinagar', 6, 5, 45999, 38999, 'Family', 'Domestic', 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80'),
('Dubai Luxury Highlights', 'dubai-luxury-highlights', 'DXB01', 'Dubai', 'United Arab Emirates', 'Dubai', 'Dubai', 5, 4, 89999, 74999, 'Luxury', 'International', 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80'),
('Goa Beach Break', 'goa-beach-break', 'GOA01', 'Goa', 'India', 'Goa', 'Panaji', 4, 3, 24999, 19999, 'Beach', 'Domestic', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO itineraries (package_id, day_number, title, description)
SELECT id, 1, 'Arrival and check-in', 'Meet our representative, transfer to hotel and relax.' FROM packages
ON DUPLICATE KEY UPDATE title = title;
INSERT INTO itineraries (package_id, day_number, title, description)
SELECT id, 2, 'Sightseeing tour', 'Guided city and attraction tour with local experiences.' FROM packages;

INSERT INTO inclusions (package_id, item, is_included)
SELECT id, 'Hotel accommodation', 1 FROM packages;
INSERT INTO inclusions (package_id, item, is_included)
SELECT id, 'Breakfast and transfers', 1 FROM packages;
INSERT INTO inclusions (package_id, item, is_included)
SELECT id, 'Personal expenses', 0 FROM packages;

INSERT INTO hotels (name, property_code, star_rating, city, state, country, address, amenities, image_url) VALUES
('Blue Horizon Resort', 'BHR01', 5, 'Goa', 'Goa', 'India', 'Candolim Beach Road', JSON_ARRAY('Pool','Wi-Fi','Spa'), 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'),
('Srinagar Lake Palace', 'SLP01', 4, 'Srinagar', 'Jammu and Kashmir', 'India', 'Dal Lake Boulevard', JSON_ARRAY('Lake view','Wi-Fi','Restaurant'), 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO room_types (hotel_id, name, description, base_price, capacity)
SELECT id, 'Deluxe Room', 'Comfortable room with breakfast.', 6500, 2 FROM hotels;
INSERT INTO room_types (hotel_id, name, description, base_price, capacity)
SELECT id, 'Premium Suite', 'Spacious suite for premium stays.', 11500, 3 FROM hotels;

INSERT INTO coupons (code, discount_type, discount_value, max_discount, min_booking_amount, valid_until) VALUES
('EARLY25', 'percentage', 25, 10000, 10000, DATE_ADD(CURDATE(), INTERVAL 1 YEAR))
ON DUPLICATE KEY UPDATE discount_value = VALUES(discount_value);

INSERT INTO payment_plans (name, advance_percentage, description) VALUES
('Advance Booking', 25, 'Pay 25% now and the balance before travel.'),
('Half Payment', 50, 'Pay 50% now and split the rest later.'),
('Full Payment', 100, 'Pay the full booking amount today.');
