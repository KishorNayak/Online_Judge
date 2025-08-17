const Problem = require("../models/problem");

const createproblem = async (req, res) => {
  try {
    const {
      title,
      discription,
      inputFormat,
      outputFormat,
      sampleTestCase,
      testcases,
      difficulty,
      tags
    } = req.body;

    const { input, output } = sampleTestCase;

    // Validate required fields
    if (!(title && discription && inputFormat && outputFormat && input && output && difficulty && tags)) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Validate testcases array
    if (!testcases || !Array.isArray(testcases) || testcases.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one test case is required",
      });
    }

    // Validate each test case has input and output
    for (let i = 0; i < testcases.length; i++) {
      const testcase = testcases[i];
      if (!testcase.input || !testcase.output) {
        return res.status(400).json({
          success: false,
          message: `Test case ${i + 1} must have both input and output`,
        });
      }
    }

    const createdProblem = await Problem.create({
      title,
      discription,
      inputFormat,
      outputFormat,
      sampleTestCase: { input, output },
      testcases,
      difficulty,
      tags
    });

    const userResponse = {
      _id: createdProblem._id,
      title: createdProblem.title,
      difficulty: createdProblem.difficulty,
      testcasesCount: createdProblem.testcases.length,
      createdAt: createdProblem.createdAt
    };

    res.status(201).json({
      success: true,
      message: "Problem created successfully!",
      problem: userResponse
    });

  } catch (error) {
    console.error("Error creating a Problem:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating problem.",
      error: error.message
    });
  }
};

// Controller function to handle GET /api/problems
// This fetches all problems with optional filters: difficulty, search, and tags
const getallproblems = async (req, res) => {
  try {
    const { difficulty, search, tags } = req.query; // Get filters from query string
     
    // Create filter object to pass to MongoDB
    const filter = {};

    if (difficulty) { filter.difficulty = difficulty;} // Filter by difficulty if provided
    if (search) {filter.title = { $regex: search, $options: 'i' };} // Case-insensitive // Search by title using regex if search term is provided
    if (tags) { // Match any of the tags // Filter by tags if provided (comma-separated)
      const tagList = tags.split(',').map(tag => new RegExp(tag, "i")); 
      filter.tags = { $in: tagList };
    }

    // Fetch problems from database sorted by latest created
    const problems = await Problem.find(filter)
  .sort({ createdAt: -1 })
  .select('title _id difficulty tags');

    // Send response to client
    res.status(200).json(problems);
  } catch (err) {
    console.error("Error fetching problems:", err.message);
    res.status(500).json({ error: 'Server error while fetching problems.' });
  }
};


// GET /api/problems/:id - Get one problem
const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    res.status(200).json(problem);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching problem' });
  }
};

//update a problem
const updateProblem = async (req, res) => {
  try {
    const updated = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: 'Problem updated', problem: updated });
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
};

// DELETE /api/problems//deleteproblem/:id - Delete a problem
const deleteProblem = async (req, res) => {
  try {
    await Problem.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Problem deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
};

module.exports ={ 
    createproblem,
    getallproblems,
    getProblemById,
    updateProblem,
    deleteProblem, };