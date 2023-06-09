import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* Register user */
export const register = async (req, res) => { // async as it is asycnhronous, req is the request from frontend, res is the response from the backend
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation,
        } = req.body;

        const salt  = await bcrypt.genSalt(); // randon salt
        const passwordHash = await bcrypt.hash(password, salt);
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser); // send created status if eveything goes, the front end receives this json
    } catch (err){
        res.status(500).json({ error: err.message })
    }
};

/* Logging in */
export const login = async(req, res) => {
    try {
        const  { email, password } =  req.body;
        const user  = await User.findOne({ email: email })
        if(!user) return res.status(400).json({ msg: "User does not exist"}); // if user is not in database send error message

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({ msg: "Invalid credentials"});

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password; // to avoid password to be sent to the frontend, just to keep it safe
        console.log(user)
        res.status(200).json({ token, user });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
