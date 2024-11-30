const express = require('express');

let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let cors = require('cors');
let bcrypt = require('bcrypt');
let path = require('path');

let app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

// Update the connection code (remove deprecated options)
let dbconnect = require("./connect.js");
dbconnect();


// Give access to static files
app.use(express.static('D:/MyWeb/final_webdev/Webdev-Project'));


app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        res.status(200).json({ message: "Login successful", user: { email: user.email, fullname: user.fullname } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});







let userSchema = new mongoose.Schema({
    fullname: { type: "string", required: true },
    email: { type: "string", required: true, unique: true },
    password: { type: "string", required: true },
});

let User = mongoose.model('User', userSchema);

app.post("/signup.html", async (req, res) => {
    const { fullname, email, password, confirmPassword } = req.body;

    // Validate passwords match
    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user to database
        const newUser = new User({ fullname, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Start Server

app.listen(4000, () => {
    console.log("Server running at 4000");
});

