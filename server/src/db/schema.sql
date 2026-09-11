CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    latitude DECIMAL,
    longitude DECIMAL,
    description VARCHAR(255),
    created_by INTEGER NOT NULL REFERENCES users (id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE workouts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users (id),
    location_id INTEGER REFERENCES locations (id),
    name VARCHAR(255),
    description VARCHAR(255),
    duration_minutes INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE exercises (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    primary_muscle VARCHAR(100),
    created_by INTEGER REFERENCES users (id),
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX unique_exercise_name ON exercises (LOWER(name));

CREATE TABLE workout_exercise (
    id SERIAL PRIMARY KEY,
    workout_id INTEGER NOT NULL REFERENCES workouts (id) ON DELETE CASCADE,
    exercise_id INTEGER NOT NULL REFERENCES exercises (id),
    sets INTEGER NOT NULL,
    reps INTEGER NOT NULL,
    weight DECIMAL
);

CREATE TABLE equipment (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE location_equipment (
    location_id INTEGER NOT NULL REFERENCES locations (id),
    equipment_id INTEGER NOT NULL REFERENCES equipment (id),
    PRIMARY KEY (location_id, equipment_id)
);