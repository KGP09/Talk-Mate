import { generateToken } from "../lib/utils.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js"
export const signup = async (req, res) => {
    const { fullName, email, password } = req.body
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({
                message: "Inavlid Credentials"
            })
        }
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters!"
            })
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const newUser = await new User({
            fullName, email,
            passWord: hashPassword,
        })
        if (newUser) {
            generateToken(newUser._id, res)
            await newUser.save()
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                mail: newUser.email,
                profilePic: newUser.profilePic


            })
        } else {
            res.status(400).json({
                message: "Invalid User Data"
            })
        }
    } catch (error) {
        console.log('Signup Error :', error);
        res.status(500).json({
            message: "Internal Server Error!"
        })
    }
}
export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                message: "Invalid Credentials!"
            })
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.passWord);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Invalid Credentials!"
            })
        }
        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            mail: user.email,
            profilePic: user.profilePic,
        })
    } catch (error) {
        console.log();
        console.log('Login Error :', error);
        return res.status(500).json({
            message: "Internal Error!"
        })
    }
}
export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {
            maxAge: 0,
        })
        res.status(200).json({
            message: "Logout Succesfull!"
        })
    } catch (error) {
        console.log("Logout Error :", error);
        return res.status(500).json({
            message: "Internal Error!"
        })
    }
}

export const updateProfile = async (res, req) => {
    try {
        const { profilePic } = req.body
        const userID = req.user._id
        if (!profilePic) {
            res.status(400).json({
                message: "Profilepicture is Mandatory!"
            })
        }
        const uploadResponse = await cloudinary.uploader(profilePic)
        const updatedUser = await User.findById(userID, {
            profilePic: uploadResponse.secure_url
        }, { new: true })
        res.status(200).json({
            message: "Profile Pic Updated!"
        })
    } catch (error) {

    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("Error in Auth!");
        req.status(500).json({
            message : "Internal Error!"
        })
    }
}