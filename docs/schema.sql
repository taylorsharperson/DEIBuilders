-- Student table
CREATE TABLE Student (
    student_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

-- Resume table
CREATE TABLE Resume (
    resume_id INT PRIMARY KEY,
    upload_date DATE NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    student_id INT,
    FOREIGN KEY (student_id) REFERENCES Student(student_id)
);

-- AnalysisResult table
CREATE TABLE AnalysisResult (
    result_id INT PRIMARY KEY,
    summary TEXT,
    student_id INT,
    resume_id INT,
    FOREIGN KEY (student_id) REFERENCES Student(student_id),
    FOREIGN KEY (resume_id) REFERENCES Resume(resume_id)
);

-- Experience table
CREATE TABLE Experience (
    experience_id INT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    company VARCHAR(100),
    start_date DATE,
    end_date DATE,
    resume_id INT,
    FOREIGN KEY (resume_id) REFERENCES Resume(resume_id)
);

-- Skill table
CREATE TABLE Skill (
    skill_id INT PRIMARY KEY,
    skill_name VARCHAR(100) NOT NULL
);

-- ResumeSkill (junction table for many-to-many Resume ↔ Skill)
CREATE TABLE ResumeSkill (
    resume_id INT,
    skill_id INT,
    PRIMARY KEY (resume_id, skill_id),
    FOREIGN KEY (resume_id) REFERENCES Resume(resume_id),
    FOREIGN KEY (skill_id) REFERENCES Skill(skill_id)
);
