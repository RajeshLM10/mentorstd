// App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const baseURL = 'http://localhost:3002';

const App = () => {
  const [mentorName, setMentorName] = useState('');
  const [studentName, setStudentName] = useState('');
  const [mentorIdForAssignment, setMentorIdForAssignment] = useState('');
  const [newMentorIdForAssignment, setNewMentorIdForAssignment] = useState('');
  const [studentIdForMentorAssignment, setStudentIdForMentorAssignment] = useState('');
  const [studentIdForPreviousMentor, setStudentIdForPreviousMentor] = useState('');

  const [mentors, setMentors] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [previousMentor, setPreviousMentor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentorsAndStudents = async () => {
      setLoading(true);
      setError(null);

      try {
        const mentorsResponse = await axios.get(`${baseURL}/mentors`);
        setMentors(mentorsResponse.data);

        const studentsResponse = await axios.get(`${baseURL}/students`);
        setStudents(studentsResponse.data);

        if (mentors.length > 0) {
          setMentorIdForAssignment(mentors[0].mentorId.toString());
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMentorsAndStudents();
  }, []); // Empty dependency array

  const createMentor = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${baseURL}/mentors`, {
        mentorName: mentorName,
      });
      console.log(response.data);
      setMentors([...mentors, response.data]);
    } catch (error) {
      console.error('Error creating mentor:', error);
      setError('Error creating mentor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const createStudent = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${baseURL}/students`, {
        studentName: studentName,
      });
      console.log(response.data);
      setStudents([...students, response.data]);
    } catch (error) {
      console.error('Error creating student:', error);
      setError('Error creating student. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const assignStudentToMentor = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3002/assign-mentor/${mentorIdForAssignment}/${studentIdForMentorAssignment}`
      );
      alert(response.data.message);
      setAssignedStudents([
        ...assignedStudents,
        students.find((s) => s.studentId === parseInt(studentIdForMentorAssignment, 10)),
      ]);
    } catch (error) {
      console.error('Error assigning student to mentor:', error);
    }
  };

  const assignMentorToStudent = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3002/assign-mentor/${studentIdForPreviousMentor}/${newMentorIdForAssignment}`
      );
      alert(response.data.message);
    } catch (error) {
      console.error('Error assigning mentor to student:', error);
    }
  };

  const showStudentsForMentor = async () => {
    try {
      const response = await axios.get(`http://localhost:3002/students/${mentorIdForAssignment}`);
      setAssignedStudents(response.data);
    } catch (error) {
      console.error('Error fetching students for mentor:', error);
    }
  };

  const showPreviousMentorForStudent = async () => {
    try {
      const response = await axios.get(`http://localhost:3002/previous-mentor/${studentIdForPreviousMentor}`);
      setPreviousMentor(response.data);
    } catch (error) {
      console.error('Error fetching previous mentor for student:', error);
    }
  };

  return (
    <div className="container">
      <h1 className="header">Mentor-Student App</h1>

      <div className="dashboard">
        <div className="card">
          <h2>Create Mentor</h2>
          <label className="label">Mentor Name:</label>
          <input
            type="text"
            value={mentorName}
            onChange={(e) => setMentorName(e.target.value)}
            className="input"
          />
          <button onClick={createMentor} className="button">
            Create Mentor
          </button>
        </div>

        <div className="card">
          <h2>Create Student</h2>
          <label className="label">Student Name:</label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="input"
          />
          <button onClick={createStudent} className="button">
            Create Student
          </button>
        </div>
      </div>

      <div className="dashboard">
        <div className="card">
          <h2>Assign Student to Mentor</h2>
          <label className="label">Mentor:</label>
          <select
            value={mentorIdForAssignment}
            onChange={(e) => setMentorIdForAssignment(e.target.value)}
            className="input"
          >
            {mentors.map((mentor) => (
              <option key={mentor.mentorId} value={mentor.mentorId}>
                {mentor.mentorName}
              </option>
            ))}
          </select>
          <label className="label">Student:</label>
          <select
            value={studentIdForMentorAssignment}
            onChange={(e) => setStudentIdForMentorAssignment(e.target.value)}
            className="input"
          >
            {students.map((student) => (
              <option key={student.studentId} value={student.studentId}>
                {student.studentName}
              </option>
            ))}
          </select>
          <button onClick={assignStudentToMentor} className="button">
            Assign Student to Mentor
          </button>
        </div>

        <div className="card">
          <h2>Assign Mentor to Student</h2>
          <label className="label">Student:</label>
          <select
            value={studentIdForPreviousMentor}
            onChange={(e) => setStudentIdForPreviousMentor(e.target.value)}
            className="input"
          >
            {students.map((student) => (
              <option key={student.studentId} value={student.studentId}>
                {student.studentName}
              </option>
            ))}
          </select>
          <label className="label">New Mentor:</label>
          <select
            value={newMentorIdForAssignment}
            onChange={(e) => setNewMentorIdForAssignment(e.target.value)}
            className="input"
          >
            {mentors.map((mentor) => (
              <option key={mentor.mentorId} value={mentor.mentorId}>
                {mentor.mentorName}
              </option>
            ))}
          </select>
          <button onClick={assignMentorToStudent} className="button">
            Assign Mentor to Student
          </button>
        </div>
      </div>

      <div className="dashboard">
        <div className="card">
          <h2>Show Students for Mentor</h2>
          <label className="label">Mentor:</label>
          <select
            value={mentorIdForAssignment}
            onChange={(e) => setMentorIdForAssignment(e.target.value)}
            className="input"
          >
            {mentors.map((mentor) => (
              <option key={mentor.mentorId} value={mentor.mentorId}>
                {mentor.mentorName}
              </option>
            ))}
          </select>
          <button onClick={showStudentsForMentor} className="button">
            Show Students
          </button>
          <ul>
            {assignedStudents.map((student) => (
              <li key={student.studentId}>{student.studentName}</li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h2>Show Previous Mentor for Student</h2>
          <label className="label">Student:</label>
          <select
            value={studentIdForPreviousMentor}
            onChange={(e) => setStudentIdForPreviousMentor(e.target.value)}
            className="input"
          >
            {students.map((student) => (
              <option key={student.studentId} value={student.studentId}>
                {student.studentName}
              </option>
            ))}
          </select>
          <button onClick={showPreviousMentorForStudent} className="button">
            Show Previous Mentor
          </button>
          {previousMentor && <p>Previous Mentor: {previousMentor.mentorName}</p>}
        </div>
      </div>
    </div>
  );
};

export default App;
