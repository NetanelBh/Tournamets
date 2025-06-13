import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { getUserbyUsername, createUser } from "../services/userServices.js";

const router = express.Router();

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const user = await getUserbyUsername(username);
        console.log(user);
        
        if(user) {
            const isMatch = bcrypt.compare(password, user.password);
            if(isMatch) {
                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
                res.send( {status: true, data: token})
            } else {
                res.send( {status: false, data: "סיסמא שגויה"})
            }
        } else {
            res.send( {status: false, data: "שם משתמש לא קיים"})
        }
    } catch (error) {
        res.send( {status: false, data: error.message})
    }
})

router.post("/register", async (req, res) => {
    const userData = req.body;
    try {
        const user = await createUser(userData);
        // Remove the password from the response
        const returnedUser = user.toObject();
        delete returnedUser.password;
        res.send( {status: true, data: returnedUser});
    } catch (error) {
        res.send( {status: false, data: error.message})
    }
})

export default router;