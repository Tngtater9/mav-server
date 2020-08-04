CREATE EXTENSION
IF NOT EXISTS "uuid-ossp";

CREATE TABLE mav_users (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    visible_name TEXT NOT NULL,
    company TEXT,
    email TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    date_created TIMESTAMPTZ NOT NULL DEFAULT now
()
);

ALTER TABLE appointments
  ADD COLUMN
    user_id INTEGER REFERENCES mav_users
(id)
    ON
DELETE
SET NULL;