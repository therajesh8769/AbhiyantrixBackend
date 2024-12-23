const express = require('express');
const passport = require('passport');

const { isAuthenticated } = require('../middlewares/auth.js');
const { registerAdmin, loginAdmin, logoutAdmin } = require('../controllers/adminController');

const router = express.Router();

router.post('/adminRegister', registerAdmin);

router.post('/login', passport.authenticate('local'), loginAdmin);
router.get('/logout', (req, res) => {
    console.log('Logout route hit');
    logoutAdmin(req, res);
  });
  

module.exports = router; 
