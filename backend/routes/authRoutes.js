const express = require('express');
const router = express.Router();


const { registerUser, loginUser } = require('../controllers/authAuthenication');



router.get('/register', (req, res) => res.send("this is register"));
router.get('/login', (req, res) => res.send("this is login"));


router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;