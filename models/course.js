const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  CourseName: { type: String, required: true, unique: true },
  CourseCode: { type: String, required: true, unique: true },
  Department: { type: String, required: true },
  Credits: { type: String, required: true },
  Semester: { type: String, required: true }, 
  Instructors: [{ type: String }],
  Sections: [{ type: String, required: true }],
  Capacity: { type: String, required: true },
  Assignments: [{ type: String }], 
});

const CourseDetails = mongoose.model('Course', CourseSchema);

module.exports = CourseDetails;
