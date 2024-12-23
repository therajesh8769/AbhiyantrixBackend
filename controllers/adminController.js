const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin.js');
const { registerValidation, loginValidation } = require('../validation/authValidation.js');

const registerAdmin = async (req, res) => {
  try {
    const { error } = registerValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, password, Name } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const newAdmin = new Admin({
      email,
      password,
      Name,
    });

    await newAdmin.save();

    const adminResponse = newAdmin.toObject();
    delete adminResponse.password;

    res.status(201).json({
      message: 'Admin registered successfully',
      admin: adminResponse,
    });
  } catch (error) {
    console.error('Error in admin registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { error } = loginValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const validPassword = await admin.comparePassword(password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    admin.lastLogin = new Date();
    await admin.save();

    req.login(admin, (err) => {
      if (err) {
        console.error('Error in login:', err);
        return res.status(500).json({ message: 'Error logging in' });
      }
      res.status(200).json({
        message: 'Logged in successfully',
        admin: { id: admin._id, email: admin.email },
      });
    });
  } catch (error) {
    console.error('Error in admin login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const logoutAdmin = (req, res) => {
    // Check if the user is authenticated
    if (req.isAuthenticated()) {
      req.logout((err) => {
        if (err) {
          console.error('Error in logout:', err);
          return res.status(500).json({ message: 'Error logging out' });
        }
        res.json({ message: 'Logged out successfully' });
      });
    } else {
      res.status(400).json({ message: 'No user is logged in' });
    }
  };
  

module.exports = {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
};
