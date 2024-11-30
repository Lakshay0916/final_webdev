const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer'); // For handling file uploads
const fs = require('fs');

// Import the database connection function
let dbconnect = require('./connect.js');
dbconnect(); // Initialize MongoDB connection

const app = express();
const PORT = 4000;

// Static file handling
app.use(express.static('D:/MyWeb/final_webdev/Webdev-Project'));

// Route to serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join('D:/MyWeb/final_webdev/Webdev-Project', 'index.html'));
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './uploads';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Define User Schema & Model
const userSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);

// Define Patient Schema & Model with MRI and X-ray uploads
const patientSchema = new mongoose.Schema({
    patientName: { type: String, required: true },
    patientAge: { type: Number, required: true },
    patientGender: { type: String, required: true },
    contactNumber: { type: String, required: true },
    medicalHistory: { type: String },
    currentMedications: { type: String },
    heartRate: { type: Number, required: true },
    bloodPressure: { type: String, required: true },
    mriScan: { type: String }, // File path for MRI scan
    xrayScan: { type: String } // File path for X-ray scan
});

const Patient = mongoose.model('Patient', patientSchema);

// Routes

// User Signup
app.post('/signup', async (req, res) => {
    const { fullname, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ fullname, email, password: hashedPassword });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// User Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        res.status(200).json({ message: 'Login successful', user: { email: user.email, fullname: user.fullname } });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add Patient with file uploads
app.post('/addPatient', upload.fields([{ name: 'mriScan' }, { name: 'xrayScan' }]), async (req, res) => {
    try {
        const patientData = {
            ...req.body,
            mriScan: req.files.mriScan ? req.files.mriScan[0].path : null,
            xrayScan: req.files.xrayScan ? req.files.xrayScan[0].path : null,
        };
        const newPatient = new Patient(patientData);
        await newPatient.save();
        res.status(201).json({ message: 'Patient data saved successfully!' });
    } catch (error) {
        console.error('Patient Save Error:', error);
        res.status(400).json({ message: 'Error saving patient data', error });
    }
});

// Fetch All Patients
app.get('/patients', async (req, res) => {
    try {
        const patients = await Patient.find();
        res.status(200).json(patients);
    } catch (error) {
        console.error('Fetch Patients Error:', error);
        res.status(500).json({ message: 'Error fetching patients' });
    }
});


app.get('/patient', async (req, res) => {
    const { name } = req.query;
    try {
        const patient = await Patient.findOne({ patientName: new RegExp(`^${name}$`, 'i') }); // Case-insensitive match
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(200).json(patient);
    } catch (error) {
        console.error('Fetch Patient Error:', error);
        res.status(500).json({ message: 'Error fetching patient details' });
    }
});


// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
