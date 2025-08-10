-- Core tables
CREATE TABLE IF NOT EXISTS rider (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT
);

CREATE TABLE IF NOT EXISTS horse (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  owner_name TEXT
);

CREATE TABLE IF NOT EXISTS class (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  max_entries INTEGER CHECK (max_entries IS NULL OR max_entries >= 0)
);

CREATE TABLE IF NOT EXISTS entry (
  id SERIAL PRIMARY KEY,
  rider_id INTEGER NOT NULL REFERENCES rider(id) ON DELETE RESTRICT,
  horse_id INTEGER NOT NULL REFERENCES horse(id) ON DELETE RESTRICT,
  UNIQUE (rider_id, horse_id)
);

-- Many-to-many: an entry can be assigned to multiple classes
CREATE TABLE IF NOT EXISTS entry_class (
  entry_id INTEGER NOT NULL REFERENCES entry(id) ON DELETE CASCADE,
  class_id INTEGER NOT NULL REFERENCES class(id) ON DELETE CASCADE,
  PRIMARY KEY (entry_id, class_id)
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_rider_name ON rider (full_name);
CREATE INDEX IF NOT EXISTS idx_horse_name ON horse (name);
CREATE INDEX IF NOT EXISTS idx_class_name ON class (name);