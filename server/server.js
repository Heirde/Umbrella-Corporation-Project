require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { MongoClient } = require("mongodb");

const app = express();
app.use(cors({
    origin: ["https://heirde.github.io", "http://localhost:3000"]
}));
app.use(express.json());

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const client = new MongoClient(process.env.MONGODB_URI);
let db;

async function connectDB() {
    try {
        await client.connect();
        db = client.db("Umbrella");
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("MongoDB connection failed:", err);
        process.exit(1);
    }
}

connectDB();

client.on("close", () => {
    console.log("MongoDB connection closed — reconnecting");
    connectDB();
});

app.use((req, res, next) => {
    if (!db) {
        return res.status(503).json({ error: "Database not ready" });
    }
    next();
});

app.post("/api/signup", async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existing = await db.collection("users").findOne({
            email: { $regex: new RegExp(`^${email}$`, 'i') }
        });

        if (existing) {
            return res.status(409).json({ error: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.collection("users").insertOne({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: "guest",
            clearance: 1,
            ownedBOWs: []
        });

        res.json({ success: true, firstName, lastName, role: "guest", clearance: 1, ownedBOWs: [] });

    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/api/signin", async (req, res) => {
    try {
        const { firstName, lastName, password } = req.body;

        if (!firstName || !lastName || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const user = await db.collection("users").findOne({
            firstName: { $regex: new RegExp(`^${firstName}$`, 'i') },
            lastName: { $regex: new RegExp(`^${lastName}$`, 'i') }
        });

        if (!user) {
            return res.status(401).json({ error: "Account not found" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: "Incorrect password" });
        }

        res.json({
            success: true,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            clearance: user.clearance,
            ownedBOWs: user.ownedBOWs || []
        });

    } catch (err) {
        console.error("Signin error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/api/purchase", async (req, res) => {
    try {
        const { firstName, lastName, bowId, bowLabel, price } = req.body;

        if (!firstName || !lastName || !bowId || !bowLabel) {
            return res.status(400).json({ error: "Missing purchase data" });
        }

        const purchaseEntry = {
            sku: bowId,
            label: bowLabel,
            price: price || 0,
            purchasedAt: new Date()
        };

        const result = await db.collection("users").updateOne(
            {
                firstName: { $regex: new RegExp(`^${firstName}$`, 'i') },
                lastName: { $regex: new RegExp(`^${lastName}$`, 'i') }
            },
            {
                $addToSet: { ownedBOWs: purchaseEntry }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ success: true, purchased: purchaseEntry });
    } catch (err) {
        console.error("Purchase error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

app.get("/api/inventory", async (req, res) => {
    try {
        const { firstName, lastName } = req.query;

        if (!firstName || !lastName) {
            return res.status(400).json({ error: "Missing user identity" });
        }

        const user = await db.collection("users").findOne(
            {
                firstName: { $regex: new RegExp(`^${firstName}$`, 'i') },
                lastName: { $regex: new RegExp(`^${lastName}$`, 'i') }
            },
            { projection: { ownedBOWs: 1 } }
        );

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ ownedBOWs: user.ownedBOWs || [] });
    } catch (err) {
        console.error("Inventory error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/api/request-reset", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const user = await db.collection("users").findOne({
            email: { $regex: new RegExp(`^${email}$`, 'i') }
        });

        if (!user) {
            return res.json({ success: true, message: "If email exists, reset link sent" });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetExpiry = Date.now() + 3600000;

        await db.collection("users").updateOne(
            { _id: user._id },
            {
                $set: {
                    resetToken,
                    resetExpiry
                }
            }
        );

        const resetLink = `https://heirde.github.io/Umbrella-Corporation-Project/reset-password.html?token=${resetToken}`;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Umbrella Corporation - Password Reset",
            html: `
                <div style="background:#000; padding:40px; font-family:Courier New, monospace;">
                    <h1 style="color:#CC0000;">UMBRELLA CORPORATION</h1>
                    <p style="color:#ccc;">A password reset request was received for your account.</p>
                    <p style="color:#ccc;">Click the link below to reset your password. This link expires in 1 hour.</p>
                    <a href="${resetLink}" style="color:#00ff41;">${resetLink}</a>
                    <p style="color:#555; margin-top:20px; font-size:12px;">If you did not request this reset, ignore this email.</p>
                </div>
            `
        });

        res.json({ success: true, message: "Reset link sent to email" });
    } catch (err) {
        console.error("Reset request error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/api/reset-password", async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ error: "Token and password required" });
        }

        const user = await db.collection("users").findOne({
            resetToken: token,
            resetExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(401).json({ error: "Invalid or expired reset token" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.collection("users").updateOne(
            { _id: user._id },
            {
                $set: { password: hashedPassword },
                $unset: { resetToken: "", resetExpiry: "" }
            }
        );

        res.json({ success: true, message: "Password reset successful" });
    } catch (err) {
        console.error("Reset password error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

app.get("/api/admin/users", async (req, res) => {
    try {
        const { firstName, lastName } = req.query;

        const requester = await db.collection("users").findOne({
            firstName: { $regex: new RegExp(`^${firstName}$`, 'i') },
            lastName: { $regex: new RegExp(`^${lastName}$`, 'i') }
        });

        if (!requester || requester.clearance < 6) {
            return res.status(403).json({ error: "Access denied" });
        }

        const users = await db.collection("users").find().toArray();

        const safeUsers = users.map(u => ({
            firstName: u.firstName,
            lastName: u.lastName,
            role: u.role,
            clearance: u.clearance
        }));

        res.json(safeUsers);

    } catch (err) {
        console.error("Admin users error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/api/admin/update", async (req, res) => {
    try {
        const { adminFirstName, adminLastName, targetFirstName, targetLastName, role, clearance } = req.body;

        const requester = await db.collection("users").findOne({
            firstName: { $regex: new RegExp(`^${adminFirstName}$`, 'i') },
            lastName: { $regex: new RegExp(`^${adminLastName}$`, 'i') }
        });

        if (!requester || requester.clearance < 6) {
            return res.status(403).json({ error: "Access denied" });
        }

        const result = await db.collection("users").updateOne(
            {
                firstName: { $regex: new RegExp(`^${targetFirstName}$`, 'i') },
                lastName: { $regex: new RegExp(`^${targetLastName}$`, 'i') }
            },
            { $set: { role, clearance: parseInt(clearance) } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ success: true });

    } catch (err) {
        console.error("Admin update error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));