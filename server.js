const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3002;

app.use(cors());
app.use(bodyParser.json());


// In-memory data store
const mentors = [];
const students = [];

// API to create Mentor
app.post('/mentors', (req, res) => {
  const { mentorName } = req.body;
  const mentor = {
    mentorId: mentors.length + 1,
    mentorName,
  };
  mentors.push(mentor);
  res.json({ mentorId: mentor.mentorId, message: 'Mentor created successfully.' });
});

// API to create Student
app.post('/students', (req, res) => {
  const { studentName } = req.body;
  const student = {
    studentId: students.length + 1,
    studentName,
    mentorId: null,
  };
  students.push(student);
  res.json({ studentId: student.studentId, message: 'Student created successfully.' });
});

// API to Assign a student to Mentor
app.post('/assign-mentor/:mentorId/:studentId', (req, res) => {
  const { mentorId, studentId } = req.params;
  const mentor = mentors.find((m) => m.mentorId == mentorId);
  const student = students.find((s) => s.studentId == studentId);

  if (!mentor || !student) {
    return res.status(404).json({ message: 'Mentor or Student not found.' });
  }

  student.mentorId = mentor.mentorId;
  res.json({ message: 'Student assigned to Mentor successfully.' });
});

// API to show all students for a particular mentor
app.get('/students/:mentorId', (req, res) => {
  const { mentorId } = req.params;
  const mentorStudents = students.filter((s) => s.mentorId == mentorId);
  res.json(mentorStudents);
});

// API to Assign or Change Mentor for particular Student
app.put('/assign-mentor/:studentId/:newMentorId', (req, res) => {
  const { studentId, newMentorId } = req.params;
  const student = students.find((s) => s.studentId == studentId);
  const newMentor = mentors.find((m) => m.mentorId == newMentorId);

  if (!student || !newMentor) {
    return res.status(404).json({ message: 'Student or New Mentor not found.' });
  }

  student.mentorId = newMentor.mentorId;
  res.json({ message: 'Mentor assigned to Student successfully.' });
});

// API to show the previously assigned mentor for a particular student
app.get('/previous-mentor/:studentId', (req, res) => {
  const { studentId } = req.params;
  const student = students.find((s) => s.studentId == studentId);

  if (!student || student.mentorId === null) {
    return res.status(404).json({ message: 'Student not found or no previous mentor.' });
  }

  const previousMentor = mentors.find((m) => m.mentorId == student.mentorId);
  res.json(previousMentor);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
