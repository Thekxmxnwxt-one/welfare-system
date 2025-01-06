CREATE TABLE welfare (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(255)
);

CREATE TABLE claims (
    id SERIAL PRIMARY KEY,
    treatment_type VARCHAR(255),
    treatment_date DATE,
    hospital_name VARCHAR(255),
    doctor_name VARCHAR(255),
    reason_for_claim TEXT,
    total_expenses DECIMAL,
    status VARCHAR(50)
);

CREATE TABLE persons (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    image VARCHAR(255),
    birthdate DATE,
    job_title VARCHAR(100),
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    address VARCHAR(255)
);