const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.registerUser = async (req, res) => {
    try {
        //input form frontend
        const { firstname, lastname, email, password } = req.body;

        //checking if all fileds are present
        if (!(firstname && lastname && email && password)) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required information: firstname, lastname, email, and password"
            });
        }

        //checking existing user if present
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        // hashing/salting the password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        //creatig the user in database
        console.log("user created");
        const user = await User.create({
            firstname: firstname.trim(),
            lastname: lastname.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
        });

        //creating the JWT token
        const token = jwt.sign(
            { 
                id: user._id,  //payload
                email: user.email 
            }, 
            process.env.SECRET_KEY, //the server uses this secret to verify it hasn’t been tampered with
            {
                expiresIn: "24h", //options
            }
        );

        // creating an user resopnse object for sending to forntend/user
        const userResponse = {
            _id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            createdAt: user.createdAt
        };

        // sending the user response
        res.status(201).json({ //.status(code)-> send https status, .json() acts as .send but parses into json 
            success: true,
            message: "User registered successfully!",
            user: userResponse,
            token: token
        });

    } catch (error) {
        console.error("Registration error:", error);
        
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validationErrors
            });
        }
        
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal server error during registration"
        });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            return res.status(400).json({
                success: false,
                message: "Please provide both email and password"
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { 
                id: user._id,
                email: user.email 
            }, 
            process.env.SECRET_KEY, 
            {
                expiresIn: "24h",
            }
        );

        const cookieOptions = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        };

        const userResponse = {
            _id: user._id,
            email: user.email
        };

        res.status(200)
           .cookie("token", token, cookieOptions)
           .json({
               success: true,
               message: "Login successful!",
               user: userResponse,
               token: token
           });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error during login"
        });
    }
};