CREATE TABLE users (id serial PRIMARY KEY, name VARCHAR(50), email VARCHAR(50), created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW());