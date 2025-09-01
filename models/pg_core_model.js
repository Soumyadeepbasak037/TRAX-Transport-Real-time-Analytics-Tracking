import db from "../config/db.js";

const CREATE_TABLE_QUERY = `
CREATE EXTENSION IF NOT EXISTS postgis;

-- Vehicles table (buses, trams, etc.)
CREATE TABLE vehicles (
    vehicle_id SERIAL PRIMARY KEY,
    vehicle_number VARCHAR(50) UNIQUE NOT NULL,
    capacity INT,
    type VARCHAR(50), -- e.g., bus, tram, metro
    operator VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Routes table (logical path vehicles follow)
CREATE TABLE routes (
    route_id SERIAL PRIMARY KEY,
    route_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Stops table (bus stops, metro stations)
CREATE TABLE stops (
    stop_id SERIAL PRIMARY KEY,
    stop_name VARCHAR(100) NOT NULL,
    location GEOGRAPHY(POINT, 4326) NOT NULL, -- latitude/longitude
    created_at TIMESTAMP DEFAULT NOW()
);

-- Trips table (specific journey of a vehicle along a route)
CREATE TABLE trips (
    trip_id SERIAL PRIMARY KEY,
    route_id INT REFERENCES routes(route_id) ON DELETE CASCADE,
    vehicle_id INT REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, ongoing, completed
    created_at TIMESTAMP DEFAULT NOW()
);

-- Vehicle position table (real-time GPS updates)
CREATE TABLE vehicle_positions (
    position_id BIGSERIAL PRIMARY KEY,
    vehicle_id INT REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
    trip_id INT REFERENCES trips(trip_id) ON DELETE CASCADE,
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    speed_mps REAL,
    heading REAL,
    accuracy REAL,
    recorded_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_vehicle_positions_location ON vehicle_positions USING GIST(location);
CREATE INDEX idx_stops_location ON stops USING GIST(location);
CREATE INDEX idx_vehicle_positions_vehicle_time ON vehicle_positions(vehicle_id, recorded_at);
`;

try {
  const result = await db.query(CREATE_TABLE_QUERY);
  console.log(res.rows[0].message);
} catch (err) {
  console.log(err);
}
