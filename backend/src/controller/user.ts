import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../model/user";
import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { validationResult } from "express-validator";
import { CustomRequest } from "../middleware/auth";

dotenv.config();

const register = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let errorMessages = errors.array().map((error) => error.msg);
        return res.status(400).json({
            status: 400,
            message: "Bad request",
            errors: errorMessages,
        });
    }
    let { username, email, password } = req.body;

    try {
        email = email.toLowerCase();

        if (await User.findOne({ email })) {
            return res.status(400).json({ message: "Email already registered!" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();
        
        return res.status(200).json({
            success: true,
            message: "User registered successfully",
            user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error,
        });
    }
}

const login = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let errorMessages = errors.array().map((error) => error.msg);
        return res.status(400).json({
            status: 400,
            message: "Bad request",
            errors: errorMessages,
        });
    }
    let { email, password } = req.body;

    try {
        email = email.toLowerCase();
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const JWT_SECRET = process.env.JWT_SECRET || "secret";

        const token = Jwt.sign({ 
            _id: user._id,
            username: user.username,
            email: user.email, 
        }, JWT_SECRET, { expiresIn: "7d" });

        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error,
        });
    }
}

const getProfile = async (req: Request, res: Response) => {
    try {
        const user_id = (req as CustomRequest).user._id;
        const user = await User.findById(user_id).select("-password");
        return res.status(200).json({
            success: true,
            message: "User profile fetched successfully",
            user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error,
        });
    }
}

const changePassword = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let errorMessages = errors.array().map((error) => error.msg);
        return res.status(400).json({
            status: 400,
            message: "Bad request",
            errors: errorMessages,
        });
    }
    let { oldPassword, newPassword } = req.body;

    try {
        const user_id = (req as CustomRequest).user._id;
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const validPassword = await bcrypt.compare(oldPassword, user.password);

        if (!validPassword) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error,
        });
    }
}

const updateProfile = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let errorMessages = errors.array().map((error) => error.msg);
      return res.status(400).json({
        status: 400,
        message: "Bad request",
        errors: errorMessages,
      });
    }

    try {
        const user_id = (req as CustomRequest).user._id;
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user?.set(req.body);
        user?.save();
        
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error,
        });
    }
}


export default { 
    register, login,
    getProfile, changePassword,
    updateProfile 
};