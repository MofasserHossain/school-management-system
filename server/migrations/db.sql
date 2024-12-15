drop database if exists school_management_system;

create database if not exists school_management_system;

create table if not exists users (
	id int AUTO_INCREMENT PRIMARY KEY,
    first_name varchar(255) not null, 
    last_name varchar(255) not null, 
    email varchar(255) not null UNIQUE,
	password varchar(255) not null,
    role ENUM('student', 'teacher', 'admin'),
    is_active boolean default false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

create table if not exists departments (
    id int AUTO_INCREMENT PRIMARY KEY,
    name varchar(255) not null, 
    alias varchar(20) not null,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

create table if not exists batches (
    id int AUTO_INCREMENT PRIMARY KEY,
    name varchar(255) not null,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

create table if not exists courses (
    id int AUTO_INCREMENT PRIMARY KEY,
    name varchar(255) not null, 
    credits int not null,
    department_id int not null, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY constraint_fk_department_id (department_id) REFERENCES departments(id) on delete cascade
);

create table if not exists course_batches (
    id int AUTO_INCREMENT PRIMARY KEY,
    term ENUM('fall', 'spring'),
    year int not null,
    section ENUM("D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10", "E1", "E2", "E3", "E4"),
    department_id int not null,
    course_id int not null, 
    batch_id int not null,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY constraint_fk_course_batch_course_id (course_id) REFERENCES courses(id) on delete cascade,
    FOREIGN KEY constraint_fk_course_batch_batch_id (batch_id) REFERENCES batches(id) on delete cascade,
    FOREIGN KEY constraint_fk_course_batch_department_id (department_id) REFERENCES departments(id) on delete cascade
);

create table if not exists user_courses (
    id int AUTO_INCREMENT PRIMARY KEY,
    type ENUM('student', 'teacher'),
    user_id int not null,
    course_batch_id int not null,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY constraint_fk_student_course_user (user_id) REFERENCES users(id) on delete cascade,
    FOREIGN KEY constraint_fk_student_course_batch (course_batch_id) REFERENCES course_batches(id) on delete cascade
);

create table if not exists attendance (
    user_id int not null,
    course_batch_id int not null,
    date date not null,
    status ENUM('present', 'absent'),
    message varchar(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY constraint_fk_attendance_user (user_id) REFERENCES users(id) on delete cascade,
    FOREIGN KEY constraint_fk_attendance_course_batch (course_batch_id) REFERENCES course_batches(id) on delete cascade,
    PRIMARY KEY (user_id, course_batch_id, date)
);

create table if not exists assignments (
    id int AUTO_INCREMENT PRIMARY KEY,
    title varchar(255) not null,
    description varchar(255),
    teacher_id int not null,
    student_id int not null,
    course_batch_id int not null,
    due_date TIMESTAMP not null,
    mark int default 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY constraint_fk_assignment_course_batch (course_batch_id) REFERENCES course_batches(id) on delete cascade,
    FOREIGN KEY constraint_fk_assignment_student (student_id) REFERENCES users(id) on delete cascade,
    FOREIGN KEY constraint_fk_assignment_teacher (teacher_id) REFERENCES users(id) on delete cascade
);

-- ALTER TABLE assignments
--     ADD teacher_id int not null,
--     ADD CONSTRAINT constraint_fk_assignment_teacher FOREIGN KEY(teacher_id) REFERENCES users(id) on delete cascade;

create table if not exists submissions (
    id int AUTO_INCREMENT PRIMARY KEY,
    assignment_id int not null,
    student_id int not null,
    link varchar(255) not null,
    course_batch_id int not null,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY constraint_fk_submission_assignment_id (assignment_id) REFERENCES assignments(id) on delete cascade,
    FOREIGN KEY constraint_fk_submission_student_id (student_id) REFERENCES users(id) on delete cascade,
    FOREIGN KEY constraint_fk_submission_course_batch (course_batch_id) REFERENCES course_batches(id) on delete cascade
);

create table if not exists grades (
    id int AUTO_INCREMENT PRIMARY KEY,
    assignment_id int not null,
    student_id int not null,
    mark int not null,
    course_batch_id int not null,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY constraint_fk_grade_assignment_id (assignment_id) REFERENCES assignments(id) on delete cascade,
    FOREIGN KEY constraint_fk_grade_student_id (student_id) REFERENCES users(id) on delete cascade,
    FOREIGN KEY constraint_fk_grade_course_batch (course_batch_id) REFERENCES course_batches(id) on delete cascade
);


insert into users (first_name, last_name, email, password, role) values ('admin', 'admin', 'admin@gmail.com', '123456', "admin");

-- -- insert data 
-- insert into departments (name, alias) values ('Computer Science and Engineering', 'CSE');
-- insert into departments (name, alias) values ('Electrical and Electronics Engineering', 'EEE');


-- insert into courses (name, credits, department_id) values ('Data Structures', 3, 1);
-- insert into courses (name, credits, department_id) values ('Algorithms', 3, 1);
-- insert into courses (name, credits, department_id) values ('Digital Logic Design', 3, 2);

-- insert into batches (name, department_id) values ('223', 1);
-- insert into batches (name, department_id) values ('223', 2);

-- insert into course_batches (term, year, section, department_id, course_id, batch_id) values ('fall', 2021, 'D1', 1, 1, 1);
-- insert into course_batches (term, year, section, department_id, course_id, batch_id) values ('fall', 2021, 'D1', 1, 2, 1);
-- insert into course_batches (term, year, section, department_id, course_id, batch_id) values ('fall', 2021, 'D1', 2, 3, 2);

-- insert into users (first_name, last_name, email, password, role, is_active) values ('John', 'Doe', 'example@gmail.com', '123456', "student", true);

-- insert into student_courses (user_id, course_batch_id) values (1, 1);

-- insert into assignments (title, description, student_id, course_batch_id, due_date) values ('Assignment 1', 'Assignment 1 description', 1, 1, '2021-10-10 00:00:00');

-- insert into submissions (assignment_id, student_id, file_path) values (1, 1, 'path/to/file');

-- insert into grades (assignment_id, student_id, mark) values (1, 1, 90);
