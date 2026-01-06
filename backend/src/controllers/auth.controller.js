const userModel = require("../models/user.model");
const foodPartnerModel= require("../models/foodpartner.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User
async function registerUser(req, res) {
    try {
        const { fullName, email, password } = req.body;

        const isUserAlreadyExist = await userModel.findOne({ email });
        if (isUserAlreadyExist) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({
            fullName,
            email,
            password: hashedPassword
        });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET
        );

        res.cookie("token", token);
        res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: user._id,
                email: user.email,
                fullName: user.fullName
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
}

// Login User
async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Create JWT token
        const token = jwt.sign({ id: user._id }, 
            process.env.JWT_SECRET

        );

        // Set cookie
        res.cookie("token", token, { httpOnly: true });

        // Respond
        res.status(200).json({
            message: "User login successfully",
            user: {
                _id: user._id,
                email: user.email,
                fullName: user.fullName
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}

function logoutUser(req,res){
    res.clearCookie("token");
    res.status(200).json({
        message:"User logged out succesfully"
    })
}

async function registerFoodPartner(req,res){
    const { 
  name,
  email,
  password,
  phone,
  address,
  contactName
} = req.body;


    const isAccountAlreadyExist = await foodPartnerModel.findOne({ email });
    if(isAccountAlreadyExist){
        return res.status(400).json({
            message: "Food Partner account already exists"
        });
    }
    
    const hashedPassword = await bcrypt.hash(password,10);
    
    const foodPartner = await foodPartnerModel.create({
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        contactName
    });
    
    const token = jwt.sign({ id: foodPartner._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.cookie("token", token, { httpOnly: true });

    res.status(201).json({
        message: "Food Partner registered successfully",
        foodPartner : {
            _id: foodPartner._id,
            email: foodPartner.email,
            name: foodPartner.name
        }
    });
}


async function loginFoodPartner(req, res) {
    try {
        const { email, password } = req.body;

        const foodPartner = await foodPartnerModel.findOne({ email });
        if (!foodPartner) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, foodPartner.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: foodPartner._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.cookie("token", token, { httpOnly: true });

        res.status(200).json({
            message: "Food partner login successfully",
            foodPartner: {
                _id: foodPartner._id,
                email: foodPartner.email,
                name: foodPartner.name
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}

function logoutfoodPartner(req,res){
    res.clearCookie("token");
    res.status(200).json({
        message:"Food Partner logged out succesfully"
    })
}


module.exports = { registerUser, loginUser, logoutUser, registerFoodPartner,loginFoodPartner, logoutfoodPartner };
