const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

//establising connection to MD database from atlas
const DBConnection = async () => {
    // Get MongoDB connection string from env file
    const MONGO_URI = process.env.MONGODB_URL;
    
    // check if the url is provided
    if (!MONGO_URI) {
        console.error("Error: MONGODB_URL environment variable is not set");
        process.exit(1);
    }
    
    // Connect to MongoDB 
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Error while connecting to the database:", error.message);
        process.exit(1); // Exit process if database connection fails
    }
};

// Export the connection function for use in other modules
module.exports = { DBConnection };