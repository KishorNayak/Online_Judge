const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true,
  },
  output: {
    type: String,
    required: true,
  }
});

const ProblemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: [3, "Title must be at least 3 characters long"],
  },
  discription: {
    type: String,
    required: true,
    minlength: [10, "Discription must be at least 10 characters long"],
  },
  inputFormat: {
    type: String,
    required: true,
  },
  outputFormat: {
    type: String,
    required: true,
  },
  sampleTestCase: {
    input: {
      type: String,
      required: true,
    },
    output: {
      type: String,
      required: true,
    },
  },
  testcases: {
    type: [testCaseSchema],
    validate: {
      validator: function(testcases) {
        return testcases && testcases.length > 0;
      },
      message: 'At least one test case is required'
    }
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  }
});

module.exports = mongoose.model("Problem", ProblemSchema);
