-- Drop existing tables
DROP TABLE IF EXISTS timetable CASCADE;
DROP TABLE IF EXISTS sections CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS faculty CASCADE;

-- Create faculty table
CREATE TABLE faculty (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL
);

-- Create timetable table exactly as requested
CREATE TABLE timetable (
    id SERIAL PRIMARY KEY,
    faculty_id VARCHAR(50) REFERENCES faculty(id) ON DELETE CASCADE,
    day VARCHAR(15) NOT NULL,
    period INT NOT NULL,
    subject_name VARCHAR(255) NOT NULL,
    branch VARCHAR(100) NOT NULL,
    year VARCHAR(50) NOT NULL
);

-- Insert Sample Data for Faculty
INSERT INTO faculty (id, name, department) VALUES
('CSFA01', 'Dr. S. Viswanadha Raju', 'Computer Science'),
('CSFA02', 'Dr. P. Swetha', 'Computer Science'),
('CSFA03', 'Shri. Joshi Shripad', 'Computer Science'),
('CSFA04', 'Dr. K. Chandrashekaraih', 'Computer Science'),
('CSFA05', 'Mrs. K. Neeraja', 'Computer Science'),
('CSFA06', 'Dr. G. Priyanka Jeeva Karunkya', 'Computer Science'),
('CSFA07', 'Dr. P. Krupa Sagar', 'Computer Science'),
('CSFA08', 'Dr. B. Sangeetha', 'Computer Science'),
('CSFA09', 'Ms. Shumama Ansa', 'Computer Science'),
('CSFA10', 'Mr. S. Harikrishna', 'Computer Science'),
('CSFA11', 'Mrs. K. Mounika', 'Computer Science'),
('CSFA12', 'Dr. Karthikeya (Guest)', 'Computer Science');

-- Insert Sample Data for Timetable
INSERT INTO timetable (faculty_id, day, period, subject_name, branch, year) VALUES
('CSFA02', 'Monday', 1, 'Discrete Mathematics', 'CSE', '2nd Year'),
('CSFA02', 'Monday', 2, 'Operating Systems', 'CSE', '2nd Year'),
('CSFA01', 'Tuesday', 4, 'Software Engineering', 'CSM', '3rd Year');
