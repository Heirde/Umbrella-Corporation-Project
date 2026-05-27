const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { MongoClient } = require("mongodb");

const app = express();
app.use(cors({
    origin: ["https://heirde.github.io", "http://localhost:3000"]
}));
app.use(express.json());

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

// Middleware to check DB is ready
app.use((req, res, next) => {
    if (!db) {
        return res.status(503).json({ error: "Database not ready" });
    }
    next();
});

// Sign up
app.post("/api/signup", async (req, res) => {
    try {
        const { firstName, lastName, password } = req.body;

        if (!firstName || !lastName || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existing = await db.collection("users").findOne({
            firstName: { $regex: new RegExp(`^${firstName}$`, 'i') },
            lastName: { $regex: new RegExp(`^${lastName}$`, 'i') }
        });

        if (existing) {
            return res.status(409).json({ error: "Account already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.collection("users").insertOne({
            firstName,
            lastName,
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

// Sign in
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

// Record a B.O.W. purchase for a signed-in user
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

// Retrieve the current user's owned B.O.W. inventory
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

// Get all users (admin only)
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

// Update user role and clearance (admin only)
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