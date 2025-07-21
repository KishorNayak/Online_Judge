// const Problem = require("../models/problem");

// exports.newproblem = async (req, res) => {
//   try {
//     const {
//       title,
//       discription,
//       inputFormat,
//       outputFormat,
//       sampleTestCase,
//       difficulty,
//       tags
//     } = req.body;

//     const { input, output } = sampleTestCase;

//     if (!(title && discription && inputFormat && outputFormat && input && output && difficulty && tags)) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide all required fields",
//       });
//     }

//     const createdProblem = await Problem.create({
//       title,
//       discription,
//       inputFormat,
//       outputFormat,
//       sampleTestCase: { input, output },
//       difficulty,
//       tags
//     });

//     const userResponse = {
//       _id: createdProblem._id,
//       title: createdProblem.title,
//       createdAt: createdProblem.createdAt
//     };

//     res.status(201).json({
//       success: true,
//       message: "Problem created successfully!",
//       problem: userResponse
//     });

//   } catch (error) {
//     console.error("Error creating a Problem:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error while creating problem.",
//       error: error.message
//     });
//   }
// };


const Problem = require("../models/problem");

exports.newproblem = async (req, res) => {
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
