import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new sqlite3.Database(join(__dirname, 'safehaven.db'));

// Initialize database tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('shelter', 'responder')),
    shelter_id TEXT,
    latitude REAL,
    longitude REAL,
    address TEXT
  )`);

  // Shelters table
  db.run(`CREATE TABLE IF NOT EXISTS shelters (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    address TEXT NOT NULL,
    current_capacity INTEGER NOT NULL DEFAULT 0,
    maximum_capacity INTEGER NOT NULL,
    food_need INTEGER NOT NULL DEFAULT 0,
    water_need INTEGER NOT NULL DEFAULT 0,
    medical_supplies_need INTEGER NOT NULL DEFAULT 0,
    blankets_need INTEGER NOT NULL DEFAULT 0,
    clothing_need INTEGER NOT NULL DEFAULT 0,
    other_needs TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'no-action' CHECK (status IN ('no-action', 'acknowledged', 'in-progress', 'completed')),
    other_information TEXT DEFAULT '',
    last_updated TEXT NOT NULL
  )`);
});

export default db;