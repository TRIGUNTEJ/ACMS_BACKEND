const mongoose = require('mongoose');

const FacultySchema = new mongoose.Schema({
  FacultyName: { type: String, required: true },
  FacultyEmail: { type: String, required: true, unique: true },
  password: { type: String },
  HighestGraduation: { type: String, required: true },
  Certifications: [{ title: String, link: String }],
  Experience: { type: String, required: true },
  ResearchPapers: [{ title: String, link: String }],
  AreaOfGraduation: { type: String, required: true },
  Section: { type: String},
  Subject: { type: String},
  Department: { 
    type: String, 
    enum : [
      'Computer Science and Engineering',
      'Mechanical Engineering',
      'Electrical Engineering',
      'Civil Engineering',
      'Electronics and Communication Engineering',
      'Electronics and Computer Engineering',
      'Internet Of Things',
      'Information Technology',
      'Bio-Medical Engineering',
      'Biotechnology',
      'Agricultural Engineering',
      'Physics',
      'Chemistry',
      'Mathematics',
      'English',
      'Open Electives',
      'freshman',
    ],
    default: 'freshman' 
  },
  Position: { 
    type: String, 
    enum: [
      'HOD', 
      'Deputy HOD', 
      'Course Coordinator', 
      'Assistant Course Coordinator', 
      'Professor', 
      'Assistant Professor', 
      'Lecturer'
    ], 
    default: 'Lecturer'
  }
});

const FacultyDetails = mongoose.model('Faculty', FacultySchema);

module.exports = FacultyDetails;
