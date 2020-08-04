CREATE EXTENSION
IF NOT EXISTS "uuid-ossp";

CREATE TABLE appointments
(
  id UUID DEFAULT uuid_generate_v4 () UNIQUE,
  title TEXT NOT NULL,
  address TEXT NOT NULL,
  longitude NUMERIC NOT NULL,
  latitude NUMERIC NOT NULL,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  description TEXT,
  date_created TIMESTAMP DEFAULT now() NOT NULL
);