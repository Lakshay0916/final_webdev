



// Middleware
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer'); // For handling file uploads
const fs = require('fs');
const jwt = require('jsonwebtoken');

const { engine } = require('express-handlebars');
// MongoDB connection
let dbconnect = require('./connect.js');
dbconnect(); // Initialize MongoDB connection

const app = express();
const PORT = 4000;

// Static file handling
app.use(express.static('D:/MyWeb/final_webdev/Webdev-Project'));




app.set("views", path.join(__dirname, "../views"));
app.use(express.static(path.join(__dirname, "../public")));

app.engine(
  "handlebars",
  engine({
    layoutsDir: path.join(__dirname, "../views"),
    partialsDir: path.join(__dirname, "../views"),
    defaultLayout: 'main'
  })
);

app.set("view engine", "handlebars");

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Home Page',
        message: 'Welcome to the Home Page'
    });
});

// Route to serve the HTML file
// app.get('/', (req, res) => {
//     res.sendFile(path.join('D:/MyWeb/final_webdev/Webdev-Project', 'index.html'));
// });

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

// Define Patient Schema & Model with a reference to User
const patientSchema = new mongoose.Schema({
    email: { type: String, required: true },
    patientName: { type: String, required: true },
    patientAge: { type: Number, required: true },
    patientGender: { type: String, required: true },
    contactNumber: { type: String, required: true },
    medicalHistory: { type: String },
    currentMedications: { type: String },
    heartRate: { type: Number, required: true },
    bloodPressure: { type: String, required: true },
    mriScan: { type: String }, // File path for MRI scan
    xrayScan: { type: String }, // File path for X-ray scan
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Link to the user who owns the patient data
});

const Patient = mongoose.model('Patient', patientSchema);

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) return res.status(403).json({ message: 'No token provided' });

    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.userId = decoded.userId; // Attach userId to the request
        next();
    });
};

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
// User Login (without JWT, just check email and password)
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

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Add Patient with file uploads
// Add Patient with file uploads (no token required)
// Add Patient with file uploads (no token required)
// Add Patient with file uploads (No token required, just use email)
app.post('/addPatient', upload.fields([{ name: 'mriScan' }, { name: 'xrayScan' }]), async (req, res) => {
    try {
        const patientData = {
            ...req.body,
            email: req.body.email, // Use email from the request body
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


// Fetch Patients Data of Logged-In User
app.get('/patients', verifyToken, async (req, res) => {
    try {
        const patients = await Patient.find({ userId: req.userId });
        res.status(200).json(patients);
    } catch (error) {
        console.error('Fetch Patients Error:', error);
        res.status(500).json({ message: 'Error fetching patients' });
    }
});

// Fetch Patient by Name (Specific to Logged-In User)
app.get('/patient', verifyToken, async (req, res) => {
    const { name } = req.query;
    try {
        const patient = await Patient.findOne({ 
            patientName: new RegExp(name, 'i'),
            userId: req.userId // Only fetch patients related to the logged-in user
        });
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(200).json(patient);
    } catch (error) {
        console.error('Fetch Patient Error:', error);
        res.status(500).json({ message: 'Error fetching patient details' });
    }
});

// Fetch Patient by Email (Specific to Logged-In User)
// Fetch Patient Data based on the Email (No token required)
app.get('/patients/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const patients = await Patient.find({ email: email });
        if (!patients || patients.length === 0) {
            return res.status(404).json({ message: 'No patients found for this email' });
        }

        res.status(200).json(patients);
    } catch (error) {
        console.error('Fetch Patient Data Error:', error);
        res.status(500).json({ message: 'Error fetching patient data' });
    }
});


// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
