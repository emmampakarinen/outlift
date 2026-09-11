INSERT INTO users (username)
VALUES ('emma');

INSERT INTO equipment (name)
VALUES
  ('Pull-up bar'),
  ('Dip bars'),
  ('Bench');

INSERT INTO locations (name, latitude, longitude, description, created_by)
VALUES (
  'Test Park',
  60.1699,
  24.9384,
  'Outdoor workout park',
  1
);

INSERT INTO location_equipment (location_id, equipment_id)
VALUES
  (1, 1),
  (1, 2);

INSERT INTO workouts (user_id, location_id)
VALUES (1, 1);

