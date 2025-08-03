const express = require('express');
const router = express.Router();

const { createproblem,
    getallproblems,
    getProblemById,
    updateProblem,
    deleteProblem, } = require('../controllers/authCRED');

//get
router.get('/createproblem', (req, res) => res.send("this is new problem page"));
router.get('/getallproblems', getallproblems); 
router.get('/getProblemById/:id', getProblemById);
router.put('/updateproblem/:id', updateProblem);
router.delete('/deleteproblem/:id', deleteProblem);

//post
router.post('/createproblem', createproblem);

module.exports = router; 