const express = require("express");
const cors = require("cors");
const { generatefile } = require("./generatefile");
const { executeCode, submitCode } = require("./exceute");
const { getaireview } = require("./getcodereview.js");
require("dotenv").config();

//calling  MongoDB connecting fucntion
const { DBConnection } = require("./database/db.js");
DBConnection(); 

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.get("/compiler", (req,res) => {
  res.send("this is compiler");
})


app.post("/compiler/run", (req, res) => {
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

app.get("/compiler/submit", (req,res) => {
  res.send("this is submit");
})

// New endpoint for code submission and evaluation
app.post("/compiler/submit", async (req, res) => {
  const { code, language, id } = req.body;

  // Validate required fields
  if (!code || !language || !id) {
    return res.status(400).json({ 
      error: "code, language, and id are required" 
    });
  }

  try {
    // Generate file for the submitted code
    const filePath = generatefile(language, code);
    console.log("Generated submission file at:", filePath);

    // Submit and evaluate the code
    const result = await submitCode(id, filePath, language);
    
    // Return the evaluation result
    res.status(200).json(result);

  } catch (err) {
    console.error("Submission error:", err);
    res.status(500).json({ 
      verdict: "ERROR",
      message: "Failed to process submission",
      error: err.message 
    });
  }
});


// End point for ai review
app.post("/compiler/ai-review", async (req,res) => {
  const { code } = req.body;

  if(!code){
    return res.status(400).json({ error: "Code is required" });
  }
  try{
    const result = await getaireview(code);
    res.status(200).json({ review: result });
  }catch(error){
    console.error("Error in ai review:", error);
    res.status(500).json({ error: "Failed to process ai review" });
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
