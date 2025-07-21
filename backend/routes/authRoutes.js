const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authAuthenication');
const { newproblem } = require('../controllers/authCRED');

router.get('/register', (req, res) => {
  res.send("this is register");
});

router.get('/login', (req, res) => {
  res.send("this is login");
});

router.get('/newproblem', (req, res) => {
  res.send("this is new problem page");
});

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/newproblem',newproblem);

module.exports = router;