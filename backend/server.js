const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

//calling  MongoDB connecting fucntion
const { DBConnection } = require("./database/db.js");
DBConnection(); 

//importing the routes
const  authRoutes = require('./routes/authRoutes.js');
const problemRoutes = require('./routes/CRUDRoutes.js')

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Health check
app.get("/", (req, res) => {
  res.status(200).json({ message: "backend is running!" });
});

// Route mounting
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});