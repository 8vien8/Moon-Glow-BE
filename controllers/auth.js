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
            maxAge: 60 * 60 * 1000 // 15 phút
        });

        // res.cookie("token", token, {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: "None", // allow cross-origin frontend to receive cookie
        //     maxAge: 15 * 60 * 1000
        // });

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

const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ error: "Logout failed" });
    }
};

const getMe = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({
            user: {
                id: user._id,
                username: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user" });
    }
}

module.exports = { register, login, logout, getMe };