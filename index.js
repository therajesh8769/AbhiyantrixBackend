
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const session = require('express-session');
const passport = require('passport');
const { configurePassport } = require('./middlewares/auth.js');
const authRoutes = require('./routes/authRoutes.js');
const eventRoutes = require('./routes/Event.js'); // Import event routes
const { User } = require("./models/User");
const cors = require("cors");
const announcementRoutes = require('./routes/announcements.js');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', "ejs");
app.use(express.json());
require('dotenv').config();


const Url = process.env.URL;

async function main() {
    try {
        await mongoose.connect(Url);
        console.log("connection success");
    } catch (err) {
        console.log(err);
    }
}

main();

app.use(cors({
    origin: "*", // Allow requests from your frontend
    methods: ["GET", "POST", "PATCH", "DELETE"], // Include PATCH and DELETE for event operations
    credentials: true               // Include credentials if necessary
}));

app.use(session({
    secret: 'rajesh',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

configurePassport();

app.use('/auth', authRoutes);
app.use('/events', eventRoutes); // Add event routes
app.use('/api/announcements', announcementRoutes);

app.get("/", (req, res) => {
    res.send("working");
});

app.post("/register", async (req, res) => {
    console.log("Request for new registration received");

    // Extracting data from the request body
    const { TeamName, members, college, email, mobile } = req.body;

    // Validating input
    if (!TeamName || !college || !email || !mobile || !members || members.length === 0) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    if (members.length > 4) {
        return res.status(400).json({ error: "Team cannot have more than 4 members" });
    }

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });

        if (existingUser) {
            return res.status(400).json({ message: 'Email or mobile already registered' });
        }
        // Creating a new user document
        const newUser = new User({
            TeamName,
            members,
            college,
            email,
            mobile,
        });

        // Saving to the database
        const savedUser = await newUser.save();

        // Sending a success response
        res.status(201).json({
            message: "Registration successful",
            data: savedUser,
        });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ error: "Server error" });
    }
});
app.get('/api/registration', async (req, res) => {
    try {
      const registrations = await User.find().sort({ createdAt: -1 });
      res.json(registrations);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      res.status(500).json({ message: 'Failed to fetch registrations', error: error.message });
    }
  });

// app.listen(8080, () => {
//     console.log("listening on port 8080");
// });
module.exports = app;

