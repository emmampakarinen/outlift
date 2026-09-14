INSERT INTO users (username) VALUES ('emma');

INSERT INTO
    locations (
        name,
        latitude,
        longitude,
        description,
        created_by
    )
VALUES (
        'Test Park',
        60.1699,
        24.9384,
        'Outdoor workout park',
        1
    );

INSERT INTO
    locations (
        name,
        latitude,
        longitude,
        description,
        created_by
    )
VALUES (
        'Test Park 2',
        70.1699,
        30.9384,
        'Skate park',
        1
    );

INSERT INTO
    workouts (
        user_id,
        location_id,
        name,
        description,
        duration_minutes
    )
VALUES (
        1,
        1,
        'Morning Circuit',
        'Full body outdoor workout',
        45
    ),
    (
        1,
        1,
        'Upper Body Strength',
        'Pull-ups, dips and push-ups',
        50
    ),
    (
        1,
        2,
        'Leg Day',
        'Lower body strength workout',
        60
    ),
    (
        1,
        2,
        'Quick HIIT',
        'Short high intensity workout',
        25
    ),
    (
        1,
        NULL,
        'Home Mobility',
        'Light mobility and recovery session',
        30
    );

INSERT INTO
    exercises (
        name,
        category,
        primary_muscle,
        is_default
    )
VALUES (
        'Bench Press',
        'strength',
        'chest',
        TRUE
    ),
    (
        'Incline Bench Press',
        'strength',
        'chest',
        TRUE
    ),
    (
        'Push Up',
        'calisthenics',
        'chest',
        TRUE
    ),
    (
        'Chest Fly',
        'strength',
        'chest',
        TRUE
    ),
    (
        'Back Squat',
        'strength',
        'quadriceps',
        TRUE
    ),
    (
        'Front Squat',
        'strength',
        'quadriceps',
        TRUE
    ),
    (
        'Goblet Squat',
        'strength',
        'quadriceps',
        TRUE
    ),
    (
        'Leg Press',
        'strength',
        'quadriceps',
        TRUE
    ),
    (
        'Leg Extension',
        'strength',
        'quadriceps',
        TRUE
    ),
    (
        'Deadlift',
        'strength',
        'back',
        TRUE
    ),
    (
        'Romanian Deadlift',
        'strength',
        'hamstrings',
        TRUE
    ),
    (
        'Barbell Row',
        'strength',
        'back',
        TRUE
    ),
    (
        'Dumbbell Row',
        'strength',
        'back',
        TRUE
    ),
    (
        'Lat Pulldown',
        'strength',
        'back',
        TRUE
    ),
    (
        'Pull Up',
        'calisthenics',
        'back',
        TRUE
    ),
    (
        'Chin Up',
        'calisthenics',
        'back',
        TRUE
    ),
    (
        'Overhead Press',
        'strength',
        'shoulders',
        TRUE
    ),
    (
        'Dumbbell Shoulder Press',
        'strength',
        'shoulders',
        TRUE
    ),
    (
        'Lateral Raise',
        'strength',
        'shoulders',
        TRUE
    ),
    (
        'Face Pull',
        'strength',
        'shoulders',
        TRUE
    ),
    (
        'Bicep Curl',
        'strength',
        'biceps',
        TRUE
    ),
    (
        'Hammer Curl',
        'strength',
        'biceps',
        TRUE
    ),
    (
        'Tricep Pushdown',
        'strength',
        'triceps',
        TRUE
    ),
    (
        'Skull Crusher',
        'strength',
        'triceps',
        TRUE
    ),
    (
        'Dip',
        'calisthenics',
        'triceps',
        TRUE
    ),
    (
        'Hip Thrust',
        'strength',
        'glutes',
        TRUE
    ),
    (
        'Glute Bridge',
        'strength',
        'glutes',
        TRUE
    ),
    (
        'Bulgarian Split Squat',
        'strength',
        'glutes',
        TRUE
    ),
    (
        'Walking Lunge',
        'strength',
        'glutes',
        TRUE
    ),
    (
        'Leg Curl',
        'strength',
        'hamstrings',
        TRUE
    ),
    (
        'Calf Raise',
        'strength',
        'calves',
        TRUE
    ),
    (
        'Clean',
        'olympic_weightlifting',
        'full_body',
        TRUE
    ),
    (
        'Power Clean',
        'olympic_weightlifting',
        'full_body',
        TRUE
    ),
    (
        'Clean and Jerk',
        'olympic_weightlifting',
        'full_body',
        TRUE
    ),
    (
        'Snatch',
        'olympic_weightlifting',
        'full_body',
        TRUE
    ),
    (
        'Power Snatch',
        'olympic_weightlifting',
        'full_body',
        TRUE
    ),
    (
        'Thruster',
        'crossfit',
        'full_body',
        TRUE
    ),
    (
        'Kettlebell Swing',
        'crossfit',
        'full_body',
        TRUE
    ),
    (
        'Wall Ball',
        'crossfit',
        'full_body',
        TRUE
    ),
    (
        'Burpee',
        'crossfit',
        'full_body',
        TRUE
    ),
    (
        'Box Jump',
        'crossfit',
        'legs',
        TRUE
    ),
    (
        'Double Under',
        'crossfit',
        'full_body',
        TRUE
    ),
    (
        'Muscle Up',
        'calisthenics',
        'full_body',
        TRUE
    ),
    (
        'Handstand Push Up',
        'calisthenics',
        'shoulders',
        TRUE
    ),
    (
        'Pistol Squat',
        'calisthenics',
        'quadriceps',
        TRUE
    ),
    ('Plank', 'core', 'core', TRUE),
    (
        'Hanging Leg Raise',
        'core',
        'core',
        TRUE
    ),
    (
        'Ab Wheel Rollout',
        'core',
        'core',
        TRUE
    ),
    (
        'Running',
        'cardio',
        'legs',
        TRUE
    ),
    (
        'Cycling',
        'cardio',
        'legs',
        TRUE
    ),
    (
        'Rowing',
        'cardio',
        'full_body',
        TRUE
    ),
    (
        'Ski Erg',
        'cardio',
        'full_body',
        TRUE
    );

INSERT INTO
    equipment (name)
VALUES ('Pull-up bar'),
    ('Dip bars'),
    ('Parallel bars'),
    ('Monkey bars'),
    ('Bench'),
    ('Sit-up bench'),
    ('Back extension bench'),
    ('Leg press'),
    ('Chest press'),
    ('Shoulder press'),
    ('Lat pulldown'),
    ('Row machine'),
    ('Air walker'),
    ('Elliptical trainer'),
    ('Exercise bike'),
    ('Stepper'),
    ('Twist machine'),
    ('Balance board'),
    ('Barbell'),
    ('No equipment');

INSERT INTO
    location_equipment (location_id, equipment_id)
VALUES (1, 1),
    (1, 2),
    (1, 3),
    (1, 5),
    (2, 1),
    (2, 4),
    (2, 6),
    (2, 8);