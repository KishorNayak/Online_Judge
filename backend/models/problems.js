const mongoose = require("mongoose");

const ProblemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: [3, "Title must be at least 3 characters long"],
  },
  description: {
    type: String,
    required: true,
    minlength: [50, "Discription must be at least 50 characters long"],
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