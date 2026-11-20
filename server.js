
const express = require('express');

const app = express();
app.use(express.json());

// Array to store students
let students = [];
let nextId = 1;

// 1. POST - Add a student
app.post('/api/students', (req, res) => {
    const { name, course, age } = req.body;

    if (!name || !course || age === undefined ||
        typeof age !== 'number') {
        return res.status(400).json({
            message: 'Missing or invalid data'
        });
    }

    const exists = students.find(
        s => s.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (exists) {
        return res.status(409).json({
            message: 'Student name already exists'
        });
    }

    const student = {
        id: nextId++,
        name: name.trim(),
        course,
        age
    };

    students.push(student);

    res.status(201).json(student);
});

// 2. GET - Get all students (with course filter)
app.get('/api/students', (req, res) => {
    const { course } = req.query;

    let result = students;

    if (course) {
        result = students.filter(
            s => s.course === course
        );
    }

    res.status(200).json(result);
});

// 3. GET - Get student by ID
app.get('/api/students/:id', (req, res) => {
    const id = Number(req.params.id);

    const student = students.find(s => s.id === id);

    if (!student) {
        return res.status(404).json({
            message: 'Student not found'
        });
    }

    res.status(200).json(student);
});

// 4. PUT - Update student
app.put('/api/students/:id', (req, res) => {
    const id = Number(req.params.id);

    const student = students.find(s => s.id === id);

    if (!student) {
        return res.status(404).json({
            message: 'Student not found'
        });
    }

    const { name, course, age } = req.body;

    if (!name || !course || age === undefined ||
        typeof age !== 'number') {
        return res.status(400).json({
            message: 'Missing or invalid data'
        });
    }

    const duplicate = students.find(
        s => s.id !== id &&
        s.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (duplicate) {
        return res.status(409).json({
            message: 'Student name already exists'
        });
    }

    student.name = name.trim();
    student.course = course;
    student.age = age;

    res.status(200).json(student);
});

// 5. DELETE - Delete student
app.delete('/api/students/:id', (req, res) => {
    const id = Number(req.params.id);

    const index = students.findIndex(s => s.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: 'Student not found'
        });
    }

    const deleted = students.splice(index, 1);

    res.status(200).json({
        message: 'Student deleted successfully',
        student: deleted[0]
    });
});

// Start server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
