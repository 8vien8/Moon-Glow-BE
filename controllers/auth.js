const User = require("../models/user")
const jwt = require("jsonwebtoken")

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const newUser = new User({ name, email, password });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(400).json({ error: "Registration failed", details: err.message });
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        // Gửi token qua HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // chỉ dùng HTTPS ở production
            sameSite: "Strict", // hoặc "Lax"
            maxAge: 15 * 60 * 1000 // 15 phút
        });

        res.json({
            user: {
                id: user._id,
                username: user.name,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Login failed" });
        next(error);
    }
};


module.exports = { register, login };