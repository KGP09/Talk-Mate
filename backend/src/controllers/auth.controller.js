import { generateToken } from "../lib/utils.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
export const signup = async (req, res) => {
    const { fullName, email, password } = req.body
    console.log(typeof (password));
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
export const login = (req, res) => {
    try {
        res.send("route ->login")
    } catch (error) {
        console.log('Login Error :', error);
    }
}
export const logout = (req, res) => {
    try {

    } catch (error) {
        console.log("Logout Error :", error);
    }
}