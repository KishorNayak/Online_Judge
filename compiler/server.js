const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { generatefile } = require("./generatefile");
const { executeCode } = require("./exceute");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.get("/compiler", (req,res) => {
  res.send("this is compiler");
})

app.post("/compiler", (req, res) => {
  const { code, language, input } = req.body;

  // Check if code and language are provided
  if (!code || !language) {
    return res.status(400).json({ error: "Code and language are required" });
  }

  try {
    const filePath = generatefile(language, code);
    console.log("Generated file at:", filePath);

    // compile and execute
    executeCode(filePath, input || '', language)
      .then((output) => res.status(200).json({ output }))
      .catch((err) => {
        console.error("Execution error:", err);
        res.status(500).json({ error: "Execution failed", details: err });
      });

  } catch (err) {
    console.error("Error generating file:", err);
    res.status(500).json({ error: "Failed to generate file" });
  }
}); 

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});